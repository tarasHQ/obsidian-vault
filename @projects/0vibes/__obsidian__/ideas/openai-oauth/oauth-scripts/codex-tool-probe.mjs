/**
 * Probe Codex Responses tool events and stateless tool-result continuation.
 * Reads the same provider config and env file as Axon without printing credentials.
 * Run with: node codex-tool-probe.mjs
 */

import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parseEnv } from 'node:util'

const axonDir = join(homedir(), '.axon')
const environment = parseEnv(readFileSync(join(axonDir, '.env'), 'utf8'))
const config = JSON.parse(readFileSync(join(axonDir, 'providers', 'openai-oauth', 'codex.json'), 'utf8'))

/** Resolves Axon's env placeholders without exposing their values. */
function resolve(value) {
	return value.replace(/\{\{([A-Z_][A-Z0-9_]*)\}\}/g, (_, name) => {
		if (!environment[name]) throw new Error(`Missing environment variable: ${name}`)
		return environment[name]
	})
}

const token = resolve(config.oauthToken || '')
if (!token) throw new Error('The openai-oauth/codex config is missing oauthToken')

const headers = new Headers({
	'Content-Type': 'application/json',
	originator: 'codex_cli_rs',
	'OpenAI-Beta': 'responses=experimental',
	'User-Agent': 'codex_cli_rs/1.99.0',
})
for (const [name, value] of Object.entries(config.headers || {})) headers.set(name, resolve(value))
headers.set('Authorization', `Bearer ${token}`)
const accountId = headers.get('chatgpt-account-id') || ''
if (!accountId) throw new Error('The provider config is missing the chatgpt-account-id header')

/** Removes credential values from diagnostics, including provider error messages. */
function redact(value) {
	let text = String(value)
	for (const secret of [token, accountId]) {
		if (secret) text = text.split(secret).join('[REDACTED]')
	}
	return text
}

/** Prints only the fields needed to understand Responses event and tool-call shapes. */
function describeEvent(event) {
	const summary = { type: event.type }
	for (const key of ['output_index', 'item_id', 'delta']) {
		if (event[key] !== undefined && event.type !== 'response.reasoning_summary_text.delta') {
			summary[key] = event[key]
		}
	}
	if (event.item) {
		summary.item = {}
		for (const key of ['type', 'id', 'call_id', 'name', 'arguments', 'status']) {
			if (event.item[key] !== undefined) summary.item[key] = event.item[key]
		}
	}
	if (event.response) {
		summary.response = {
			status: event.response.status,
			output_types: event.response.output?.map((item) => item.type),
			error: event.response.error,
			incomplete_details: event.response.incomplete_details,
		}
	}
	if (event.error) summary.error = event.error
	console.log(redact(JSON.stringify(summary)))
}

const instructions = 'You are a helpful assistant. Always call the probe_value tool when asked to use it.'
const initialInput = [
	{ role: 'user', content: [{ type: 'input_text', text: 'Use probe_value, then tell me the returned value.' }] },
]
const tools = [
	{
		type: 'function',
		name: 'probe_value',
		description: 'Return a fixed test value.',
		parameters: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'], additionalProperties: false },
		strict: false,
	},
]

/** Sends a small request and collects the completed output items for a follow-up. */
async function probe(label, input) {
	console.log(`\n=== ${label} ===`)
	const response = await fetch(`${config.baseUrl.replace(/\/+$/, '')}/responses`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ model: config.modelId, instructions, input, tools, stream: true, store: false }),
		signal: AbortSignal.timeout(90000),
	})
	console.log(`HTTP ${response.status}`)
	const body = await response.text()
	if (!response.ok) {
		console.log(redact(body.slice(0, 3000)))
		return { ok: false, output: [] }
	}

	let completed
	let failed = false
	const finishedItems = new Map()
	for (const block of body.split(/\r?\n\r?\n/)) {
		const data = block.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n')
		if (!data || data === '[DONE]') continue
		let event
		try {
			event = JSON.parse(data)
		} catch {
			throw new Error('The backend returned an SSE data block that is not valid JSON')
		}
		describeEvent(event)
		if (event.type === 'response.output_item.done' && event.item) finishedItems.set(event.output_index, event.item)
		if (event.type === 'response.completed') completed = event.response
		if (event.type === 'response.failed' || event.type === 'response.incomplete' || event.type === 'error') failed = true
	}
	if (!completed || failed) {
		console.log('Stream did not complete successfully.')
		return { ok: false, output: [] }
	}
	const output = completed.output?.length
		? completed.output
		: [...finishedItems.entries()].sort(([a], [b]) => a - b).map(([, item]) => item)
	return { ok: true, output }
}

try {
	const first = await probe('First turn: tool call', initialInput)
	if (!first.ok) throw new Error('First turn failed')
	const calls = first.output.filter((item) => item.type === 'function_call')
	if (calls.length !== 1 || calls[0].name !== 'probe_value' || !calls[0].call_id) {
		throw new Error(`Expected one probe_value call with a call_id; received ${calls.length} function calls`)
	}

	// Reconstruct the call as Axon's stored history can, without reasoning items.
	const reconstructed = first.output.flatMap((item) => {
		if (item.type === 'function_call') {
			return [{ type: 'function_call', call_id: item.call_id, name: item.name, arguments: item.arguments }]
		}
		if (item.type === 'message') return [{ role: 'assistant', content: item.content }]
		return []
	})
	const results = calls.map((call) => ({ type: 'function_call_output', call_id: call.call_id, output: '{"value":"probe-ok"}' }))
	const continuation = await probe('Continuation: reconstructed history, no reasoning item', [...initialInput, ...reconstructed, ...results])
	if (continuation.ok) {
		console.log('\nPASS: tool call and reconstructed tool-result continuation completed.')
	} else if (first.output.some((item) => item.type === 'reasoning')) {
		console.log('\nRetrying with the original reasoning item preserved.')
		const preserved = await probe('Continuation: original output including reasoning', [...initialInput, ...first.output, ...results])
		if (preserved.ok) console.log('\nPASS with preserved reasoning only; Axon needs a way to replay that item.')
		else throw new Error('Both continuation variants failed')
	} else {
		throw new Error('Reconstructed continuation failed and no reasoning item was available to retry')
	}
} catch (error) {
	console.error(`\nPROBE FAILED: ${redact(error instanceof Error ? error.message : error)}`)
	process.exitCode = 1
}

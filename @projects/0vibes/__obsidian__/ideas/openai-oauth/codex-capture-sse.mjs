/**
 * Capture one raw Codex Responses API stream for local diagnosis.
 *
 * Reads the token and account ID from the same files Axon uses.
 * The output file may contain sensitive content; review before sharing.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const desktop = dirname(fileURLToPath(import.meta.url))
const axonDir = join(homedir(), '.axon')
const outputPath = join(desktop, 'codex-raw-sse.txt')

// Read the token the same way as the existing codex-debug.mjs probe.
const envText = readFileSync(join(axonDir, '.env'), 'utf8')
const match = envText.match(/^OPENAI_OAUTH_TOKEN=(.*)$/m)

if (!match) {
	throw new Error('OPENAI_OAUTH_TOKEN not found in ~/.axon/.env')
}

const token = match[1].trim().replace(/^["']|["']$/g, '')

if (!token) {
	throw new Error('OPENAI_OAUTH_TOKEN is empty')
}

// Use the configured model, account ID, and optional reasoning effort.
const configPath = join(axonDir, 'providers', 'openai-oauth', 'terra.json')
const config = JSON.parse(readFileSync(configPath, 'utf8'))

const accountId = Object.entries(config.headers ?? {}).find(([key]) => key.toLowerCase() === 'chatgpt-account-id')?.[1]

if (!accountId) {
	throw new Error(`chatgpt-account-id not found in ${configPath}`)
}

// Replace this with a non-sensitive version of the prompt you want to test.
const prompt = `
A workshop has three machines and five jobs with different durations.
Explain an approach for scheduling the jobs to minimize the total completion time.
`

const body = {
	model: config.modelId,
	instructions: 'You are a helpful assistant.',
	input: [
		{
			role: 'user',
			content: [{ type: 'input_text', text: prompt.trim() }],
		},
	],
	stream: true,
	store: false,
	reasoning: {
		...(config.parameters?.reasoning?.effort ? { effort: config.parameters.reasoning.effort } : {}),
	},
}

const response = await fetch(`${config.baseUrl.replace(/\/+$/, '')}/responses`, {
	method: 'POST',
	headers: {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
		Accept: 'text/event-stream',
		originator: 'codex_cli_rs',
		'chatgpt-account-id': accountId,
		'OpenAI-Beta': 'responses=experimental',
		'User-Agent': 'codex_cli_rs/1.99.0',
	},
	body: JSON.stringify(body),
})

// Save the response body without parsing or modifying it.
// This waits for the stream to finish before writing the file.
const raw = await response.text()
writeFileSync(outputPath, raw, 'utf8')

console.log(`HTTP status: ${response.status}`)
console.log(`Model: ${config.modelId}`)
console.log(`Response saved to: ${outputPath}`)

if (!response.ok) {
	console.error('The capture contains an HTTP error response; inspect it locally.')
	process.exitCode = 1
} else {
	// Print event counts, not event contents, to avoid dumping the response.
	const counts = new Map()

	for (const line of raw.split(/\r\n|\n|\r/)) {
		if (!line.startsWith('data:')) continue

		const data = line.slice(5).trim()
		if (!data || data === '[DONE]') continue

		try {
			const event = JSON.parse(data)
			const type = event.type ?? '(no type)'
			counts.set(type, (counts.get(type) ?? 0) + 1)
		} catch {
			// The raw file remains authoritative if an event isn't one-line JSON.
		}
	}

	console.log('\nEvent types:')
	for (const [type, count] of counts) {
		console.log(`  ${String(count).padStart(4)}  ${type}`)
	}
}

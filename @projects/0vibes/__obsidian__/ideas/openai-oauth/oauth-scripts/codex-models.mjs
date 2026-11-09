/**
 * codex-models.mjs — enumerate the model catalog available to your ChatGPT
 * account on the Codex backend, then probe /responses with each listed model.
 *
 * Reads tokens from codex-oauth-tokens.json (same directory).
 * Usage: node codex-models.mjs
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const tokens = JSON.parse(readFileSync(join(here, 'codex-oauth-tokens.json'), 'utf8'))
const ACCOUNT_ID = 'a5ddb047-567d-43d3-8bd5-573483e41fa4'
const CODEX_BASE = 'https://chatgpt.com/backend-api/codex'
const CLIENT_VERSION = '0.21.0'

const headers = {
	Authorization: `Bearer ${tokens.access_token}`,
	'Content-Type': 'application/json',
	originator: 'codex_cli_rs',
	'chatgpt-account-id': ACCOUNT_ID,
	'OpenAI-Beta': 'responses=experimental',
	'User-Agent': `codex_cli_rs/${CLIENT_VERSION}`,
}

// --- 1. Fetch model catalog -------------------------------------------------
const g = await fetch(`${CODEX_BASE}/models?client_version=${CLIENT_VERSION}`, { headers })
const modelsText = await g.text()
console.log(`GET /models → ${g.status}`)
console.log(modelsText.length > 1200 ? modelsText.slice(0, 1200) + '…(truncated)' : modelsText)

let modelIds = []
try {
	const parsed = JSON.parse(modelsText)
	// Defensive: handle {models:[...]} / [{...}] / {data:[...]} shapes
	const list = parsed.models ?? parsed.data ?? (Array.isArray(parsed) ? parsed : [])
	modelIds = list.map((m) => (typeof m === 'string' ? m : m.slug ?? m.id ?? m.model ?? m.name)).filter(Boolean)
} catch {
	console.log('(could not parse /models response as JSON — will fall back to probe list)')
}

// Fallback probe list if catalog parse fails
if (modelIds.length === 0) {
	modelIds = ['gpt-5', 'gpt-5.1', 'gpt-5.2', 'gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'codex-mini-latest']
	console.log('\nFallback probe list:', modelIds.join(', '))
}

// --- 2. Probe /responses with each model ------------------------------------
console.log('\n--- probing /responses with each model ---')
for (const model of modelIds.slice(0, 12)) {
	try {
		const r = await fetch(`${CODEX_BASE}/responses`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				model,
				instructions: 'You are a helpful assistant.',
				input: 'hi',
				stream: true,
				store: false,
			}),
		})
		const body = await r.text()
		let summary = body
		try {
			const parsed = JSON.parse(body)
			// eslint-disable-next-line no-unused-vars -- parsed kept for field access below
			// SSE stream errors come as JSON too; capture the informative fields
			summary = JSON.stringify({ code: parsed.error?.code ?? parsed.detail, msg: parsed.error?.message })
		} catch {
			// Non-JSON (likely SSE stream data) — success signal
			summary = body.slice(0, 200)
		}
		console.log(`\n${model} → ${r.status}`)
		console.log(summary.slice(0, 300))
	} catch (e) {
		console.log(`\n${model} → NETWORK FAILURE: ${e.message}`)
	}
}

/**
 * codex-debug.mjs — diagnose the 401 "Could not parse your authentication token".
 *
 * Reads OPENAI_OAUTH_TOKEN from ~/.axon/.env (the same source the Axon server uses),
 * validates the JWT structure/claims, then replays the request paths Axon uses.
 *
 * Usage: node codex-debug.mjs
 */

import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const ACCOUNT_ID = 'a5ddb047-567d-43d3-8bd5-573483e41fa4'
const CODEX_BASE = 'https://chatgpt.com/backend-api/codex'

// --- 1. Load token exactly like the server would --------------------------
const envText = readFileSync(join(homedir(), '.axon', '.env'), 'utf8')
const match = envText.match(/^OPENAI_OAUTH_TOKEN=(.*)$/m)
if (!match) {
	console.error('OPENAI_OAUTH_TOKEN not found in ~/.axon/.env')
	process.exit(1)
}
const token = match[1].trim().replace(/^["']|["']$/g, '')

console.log('Token length:', token.length)
console.log('First 24:', token.slice(0, 24))
console.log('Last 12 :', token.slice(-12))

// --- 2. JWT integrity check ----------------------------------------------
const segments = token.split('.')
console.log('\nJWT segments:', segments.length, segments.length === 3 ? '(ok)' : '(INVALID — token mangled or not a JWT)')

if (segments.length === 3) {
	try {
		const payload = JSON.parse(Buffer.from(segments[1], 'base64url').toString())
		console.log('\nPayload claims:')
		console.log(JSON.stringify(payload, null, 2))
		if (payload.exp) {
			const remaining = Math.round((payload.exp * 1000 - Date.now()) / 60000)
			console.log(`\nExpires in: ${remaining} minutes ${remaining < 0 ? '(EXPIRED!)' : ''}`)
		}
	} catch (e) {
		console.error('\nPayload segment failed to decode:', e.message, '→ token is corrupted')
	}
}

// --- 3. Replay requests against the codex backend -------------------------
const headers = {
	Authorization: `Bearer ${token}`,
	'Content-Type': 'application/json',
	originator: 'codex_cli_rs',
	'chatgpt-account-id': ACCOUNT_ID,
	'User-Agent': 'codex_cli_rs/0.21.0',
}

async function probe(path, body, label) {
	try {
		const res = await fetch(`${CODEX_BASE}${path}`, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		})
		const text = await res.text()
		console.log(`\n=== ${label} → status ${res.status} ${res.statusText}`)
		console.log(text.length > 600 ? text.slice(0, 600) + '…(truncated)' : text)
	} catch (e) {
		console.log(`\n=== ${label} → NETWORK FAILURE: ${e.message} (cause: ${e.cause?.code ?? e.cause})`)
	}
}

// 3a. The exact request Axon's protocol makes (chat-completions shape)
await probe('/chat/completions', { model: 'gpt-5.1-codex', messages: [{ role: 'user', content: 'hi' }] }, 'chat/completions (Axon-style)')

// 3b. Responses API shape (what the codex backend actually serves)
await probe('/responses', { model: 'gpt-5.1-codex', input: 'hi', stream: false }, 'responses (codex-style)')

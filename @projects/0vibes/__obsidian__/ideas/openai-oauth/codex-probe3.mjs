/**
 * codex-probe3.mjs — probe /responses with catalog models using the correct
 * structured input format (Responses API: input must be a list of messages).
 *
 * Usage: node codex-probe3.mjs
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const tokens = JSON.parse(readFileSync(join(here, 'codex-oauth-tokens.json'), 'utf8'))
const ACCOUNT_ID = 'a5ddb047-567d-43d3-8bd5-573483e41fa4'
const CODEX_BASE = 'https://chatgpt.com/backend-api/codex'
const CLIENT_VERSION = '1.99.0'

const headers = {
	Authorization: `Bearer ${tokens.access_token}`,
	'Content-Type': 'application/json',
	originator: 'codex_cli_rs',
	'chatgpt-account-id': ACCOUNT_ID,
	'OpenAI-Beta': 'responses=experimental',
	'User-Agent': `codex_cli_rs/${CLIENT_VERSION}`,
}

const models = ['gpt-6-luna', 'gpt-5.6-terra', 'gpt-5.6-luna']

for (const model of models) {
	try {
		const r = await fetch(`${CODEX_BASE}/responses`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				model,
				instructions: 'You are a helpful assistant.',
				input: [{ role: 'user', content: [{ type: 'input_text', text: 'Say OK and nothing else.' }] }],
				stream: true,
				store: false,
			}),
		})
		const body = await r.text()
		console.log(`\n${model} → ${r.status}`)
		console.log(body.length > 700 ? body.slice(0, 700) + '…(truncated)' : body)
	} catch (e) {
		console.log(`\n${model} → NETWORK FAILURE: ${e.message}`)
	}
}

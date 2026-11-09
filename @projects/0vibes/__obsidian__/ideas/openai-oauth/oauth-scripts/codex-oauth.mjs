/**
 * codex-oauth.mjs — manual ChatGPT OAuth dance for Axon (no server involvement).
 *
 * Usage:
 *   node codex-oauth.mjs            → Phase 1: generates PKCE pair, saves verifier,
 *                                     prints the authorize URL to open in a browser.
 *   node codex-oauth.mjs <code>     → Phase 2: exchanges the authorization code
 *                                     (copied from the refused-page URL) for tokens.
 *                                     Saves full tokens to codex-oauth-tokens.json
 *                                     and prints the chatgpt account id.
 *
 * Run both phases from the same directory so the verifier file is found.
 * The verifier file is deleted after a successful exchange (it's single-use).
 */

import { createHash, randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs'

const CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann'
const ISSUER = 'https://auth.openai.com'
const REDIRECT = 'http://localhost:1455/auth/callback'
const STATE_FILE = 'codex-oauth-verifier.tmp'
const TOKENS_FILE = 'codex-oauth-tokens.json'

const code = process.argv[2]

// ---------------------------------------------------------------- Phase 1
async function phase1() {
	const verifier = randomBytes(32).toString('base64url')
	const challenge = createHash('sha256').update(verifier).digest('base64url')
	writeFileSync(STATE_FILE, verifier)

	const url = new URL(`${ISSUER}/oauth/authorize`)
	url.searchParams.set('response_type', 'code')
	url.searchParams.set('client_id', CLIENT_ID)
	url.searchParams.set('redirect_uri', REDIRECT)
	url.searchParams.set('scope', 'openid profile email offline_access')
	url.searchParams.set('code_challenge', challenge)
	url.searchParams.set('code_challenge_method', 'S256')
	url.searchParams.set('state', randomBytes(16).toString('base64url'))

	console.log('Verifier saved to ' + STATE_FILE)
	console.log('')
	console.log('Open this URL in the browser (copy it as ONE line):')
	console.log('')
	console.log(url.toString())
	console.log('')
	console.log('After login you will land on a "connection refused" page — that is EXPECTED.')
	console.log('Copy the code= value from the address bar, then run:')
	console.log('')
	console.log('  node codex-oauth.mjs <code>')
}

// ---------------------------------------------------------------- dispatch
if (!code) await phase1()
if (!code) process.exit(0)

// ---------------------------------------------------------------- Phase 2
if (!existsSync(STATE_FILE)) {
	console.error('No stored verifier found — run `node codex-oauth.mjs` (no args) first.')
	process.exit(1)
}
const verifier = readFileSync(STATE_FILE, 'utf8').trim()

const res = await fetch(`${ISSUER}/oauth/token`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'User-Agent': 'codex_cli_rs/0.21.0',
	},
	body: new URLSearchParams({
		grant_type: 'authorization_code',
		code,
		redirect_uri: REDIRECT,
		client_id: CLIENT_ID,
		code_verifier: verifier,
	}).toString(),
})
const text = await res.text()

if (!res.ok) {
	console.error(`FAILED: ${res.status}`)
	console.error(text)
	console.error('')
	console.error('If the code was already used or expired, run phase 1 again for a fresh PKCE pair.')
	process.exit(1)
}

const tokens = JSON.parse(text)
writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2))
unlinkSync(STATE_FILE)

// Extract chatgpt account id from id_token claims (needed for chatgpt-account-id header)
let accountId
try {
	const claims = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64url').toString())
	accountId =
		claims.chatgpt_account_id ??
		claims['https://api.openai.com/auth']?.chatgpt_account_id ??
		claims.organizations?.[0]?.id
} catch {
	// id_token missing/unexpected shape — account id stays undefined
}

console.log('SUCCESS — full tokens saved to ' + TOKENS_FILE)
console.log('')
console.log('access_token :', tokens.access_token?.slice(0, 24) + '…')
console.log('refresh_token:', tokens.refresh_token?.slice(0, 24) + '…')
console.log('expires_in   :', tokens.expires_in)
console.log('account_id   :', accountId ?? '(not found in id_token claims)')
console.log('')
console.log('Next steps:')
console.log('  1. Copy access_token value into ~/.axon/.env as OPENAI_OAUTH_TOKEN')
console.log('  2. Restart the Axon server')
console.log('  3. Provider config: providerId=openai-oauth, oauthToken={{OPENAI_OAUTH_TOKEN}}')
console.log('     headers: { originator: codex_cli_rs, chatgpt-account-id: <account_id above> }')

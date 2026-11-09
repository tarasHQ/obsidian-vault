/**
 * Reauthenticate Axon's ChatGPT/Codex provider without running a callback listener.
 * Run with Node.js, open the printed URL, and paste the complete callback URL.
 * The access token is printed and saved to ~/.axon/.env; refresh tokens are discarded.
 */

import { createHash, randomBytes } from 'node:crypto'
import { lstat, mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann'
const ISSUER = 'https://auth.openai.com'
const REDIRECT_URI = 'http://localhost:1455/auth/callback'
const ENV_PATH = join(homedir(), '.axon', '.env')
const ENV_KEY = 'OPENAI_OAUTH_TOKEN'

/** Keeps the verifier and state in memory for one interactive authorization. */
async function main() {
	const verifier = randomBytes(32).toString('base64url')
	const challenge = createHash('sha256').update(verifier).digest('base64url')
	const state = randomBytes(32).toString('base64url')
	const authorizeUrl = new URL('/oauth/authorize', ISSUER)
	authorizeUrl.search = new URLSearchParams({
		response_type: 'code',
		client_id: CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		scope: 'openid profile email offline_access',
		code_challenge: challenge,
		code_challenge_method: 'S256',
		state,
	}).toString()

	console.log('\nOpen this entire URL in your browser:\n')
	console.log(authorizeUrl.toString())
	console.log('\nAfter login, the localhost page may say it cannot connect. That is expected.')
	console.log('Copy the COMPLETE URL from the browser address bar, including code and state.\n')

	const prompt = createInterface({ input: stdin, output: stdout })
	let callback
	try {
		callback = await prompt.question('Paste callback URL: ')
	} finally {
		prompt.close()
	}

	const code = readCallbackCode(callback, state)
	const tokens = await exchangeCode(code, verifier)
	const accessToken = tokens.access_token
	if (typeof accessToken !== 'string' || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(accessToken)) {
		throw new Error('Token endpoint did not return a complete three-part access-token JWT.')
	}

	// Print before the file write so the token is recoverable if saving fails.
	console.log('\nAccess token (secret; do not share it):\n')
	console.log(accessToken)

	const accountId = readAccountId(tokens.id_token) ?? readAccountId(accessToken)
	console.log(`\nChatGPT account ID: ${accountId ?? '(not found in token claims)'}`)
	console.log('Make sure this matches the chatgpt-account-id in your provider config.')
	if (typeof tokens.expires_in === 'number') {
		console.log(`Expires in: ${tokens.expires_in} seconds`)
	}

	await updateEnvToken(accessToken)
	console.log(`\nUpdated ${ENV_PATH}`)
	console.log('Restart the Axon server to ensure it loads the new token.')
	console.log('No refresh token was saved; repeat this flow when the access token expires.')
}

/** Rejects callbacks from a different authorization or redirect target. */
function readCallbackCode(input, expectedState) {
	let url
	try {
		url = new URL(input.trim())
	} catch {
		throw new Error('Paste the full callback URL from the browser address bar, not just the code.')
	}

	const expected = new URL(REDIRECT_URI)
	if (url.origin !== expected.origin || url.pathname !== expected.pathname || url.hash || url.username || url.password) {
		throw new Error(`Callback must point to ${REDIRECT_URI}.`)
	}
	if (url.searchParams.getAll('state').length !== 1 || url.searchParams.get('state') !== expectedState) {
		throw new Error('Callback state is missing or does not match this run. Start again with a new login URL.')
	}
	if (url.searchParams.has('error')) {
		throw new Error('OpenAI did not authorize the request. Start again and check the browser for details.')
	}
	const codes = url.searchParams.getAll('code')
	if (codes.length !== 1 || !codes[0]) {
		throw new Error('Callback must contain exactly one authorization code.')
	}
	return codes[0]
}

/** Exchanges the single-use code without logging the response or refresh token. */
async function exchangeCode(code, verifier) {
	const response = await fetch(`${ISSUER}/oauth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'codex_cli_rs/1.99.0',
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: REDIRECT_URI,
			client_id: CLIENT_ID,
			code_verifier: verifier,
		}),
		signal: AbortSignal.timeout(30_000),
	})
	if (!response.ok) {
		throw new Error(`Token exchange failed (HTTP ${response.status}). Start again with a new login URL.`)
	}
	const tokens = await response.json()
	if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
		throw new Error('Token endpoint returned an unexpected response.')
	}
	return tokens
}

/** Reads the account hint for display; this does not verify the JWT signature. */
function readAccountId(token) {
	if (typeof token !== 'string') return undefined
	const parts = token.split('.')
	if (parts.length !== 3) return undefined
	let claims
	try {
		claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
	} catch {
		console.warn('Could not decode token claims to identify the ChatGPT account.')
		return undefined
	}
	if (!claims || typeof claims !== 'object') return undefined
	const accountId = claims.chatgpt_account_id ?? claims['https://api.openai.com/auth']?.chatgpt_account_id
	return typeof accountId === 'string' && accountId ? accountId : undefined
}

/** Replaces only the token line, using a same-directory temporary file to avoid truncation. */
async function updateEnvToken(token) {
	await mkdir(dirname(ENV_PATH), { recursive: true })
	let envText = ''
	let mode = 0o600
	try {
		const file = await lstat(ENV_PATH)
		if (!file.isFile()) throw new Error(`${ENV_PATH} is not a regular file; refusing to replace it.`)
		mode = file.mode & 0o777
		envText = await readFile(ENV_PATH, 'utf8')
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
	}

	const pattern = /^(\uFEFF?)[\t ]*(?:export[\t ]+)?OPENAI_OAUTH_TOKEN[\t ]*=[^\r\n]*/gm
	const matches = [...envText.matchAll(pattern)]
	if (matches.length > 1) throw new Error(`Multiple ${ENV_KEY} entries found in ${ENV_PATH}; resolve them before retrying.`)
	if (matches.length === 1) {
		envText = envText.replace(pattern, (_, bom) => `${bom}${ENV_KEY}=${token}`)
	} else {
		const newline = envText.includes('\r\n') ? '\r\n' : '\n'
		const separator = envText && !envText.endsWith('\n') && !envText.endsWith('\r') ? newline : ''
		envText += `${separator}${ENV_KEY}=${token}${newline}`
	}

	const tempPath = `${ENV_PATH}.${randomBytes(12).toString('hex')}.tmp`
	let tempCreated = false
	try {
		const tempFile = await open(tempPath, 'wx', mode)
		tempCreated = true
		try {
			await tempFile.writeFile(envText, 'utf8')
		} finally {
			await tempFile.close()
		}
		await rename(tempPath, ENV_PATH)
		tempCreated = false
	} finally {
		if (tempCreated) {
			try {
				await unlink(tempPath)
			} catch (error) {
				console.error(`Could not remove temporary env file ${tempPath}: ${error.message}`)
			}
		}
	}
}

try {
	await main()
} catch (error) {
	console.error(`\nReauthentication failed: ${error instanceof Error ? error.message : String(error)}`)
	process.exitCode = 1
}

/**
 * codex-setenv.mjs — write OPENAI_OAUTH_TOKEN (and account id) from
 * codex-oauth-tokens.json into ~/.axon/.env safely (no manual copy-paste).
 *
 * - Reads the full access_token from codex-oauth-tokens.json (same directory).
 * - Updates OPENAI_OAUTH_TOKEN in ~/.axon/.env (replaces existing line or appends).
 * - Validates the token is a complete 3-segment JWT before writing.
 * - Leaves all other .env content untouched.
 *
 * Usage: node codex-setenv.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const tokensPath = join(here, 'codex-oauth-tokens.json')
const envPath = join(homedir(), '.axon', '.env')

// --- read tokens -----------------------------------------------------------
if (!existsSync(tokensPath)) {
	console.error('codex-oauth-tokens.json not found next to this script.')
	process.exit(1)
}
const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'))
const token = tokens.access_token

if (!token) {
	console.error('No access_token in tokens file.')
	process.exit(1)
}
const segments = token.split('.')
if (segments.length !== 3) {
	console.error(`access_token is not a complete JWT (${segments.length} segments) — refusing to write.`)
	process.exit(1)
}
// sanity: decode payload to show what we're about to write
const claims = JSON.parse(Buffer.from(segments[1], 'base64url').toString())
console.log('access_token looks valid:')
console.log('  length    :', token.length)
console.log('  aud       :', claims.aud)
console.log('  exp       :', claims.exp ? new Date(claims.exp * 1000).toISOString() : '(none)')

// --- update .env -----------------------------------------------------------
const KEY = 'OPENAI_OAUTH_TOKEN'
const line = `${KEY}=${token}`

let envText = ''
if (existsSync(envPath)) {
	envText = readFileSync(envPath, 'utf8')
} else {
	console.log(`(creating new ${envPath})`)
}

const lines = envText.split(/\r?\n/)
const idx = lines.findIndex((l) => l.startsWith(`${KEY}=`))
if (idx >= 0) {
	lines[idx] = line
	console.log(`Replaced existing ${KEY} line (${idx + 1}).`)
} else {
	lines.push(line)
	console.log(`Appended ${KEY} line.`)
}

writeFileSync(envPath, lines.join('\n'), 'utf8')
console.log(`\nWrote ${envPath}`)
console.log(`  new line length: ${line.length} chars`)
console.log('\nRestart the Axon server (or trigger config reload), then retry the test message.')

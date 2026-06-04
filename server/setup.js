#!/usr/bin/env node
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CREDS_FILE = path.join(__dirname, '..', '.credentials')

function ask(question, hidden = false) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: hidden ? null : process.stdout,
      terminal: hidden,
    })
    if (hidden) {
      process.stdout.write(question)
      process.stdin.setRawMode?.(true)
      let input = ''
      process.stdin.resume()
      process.stdin.setEncoding('utf8')
      process.stdin.once('data', function handler(ch) {
        ch = ch.toString()
        if (ch === '\n' || ch === '\r' || ch === '') {
          process.stdin.setRawMode?.(false)
          process.stdin.pause()
          process.stdin.removeListener('data', handler)
          process.stdout.write('\n')
          rl.close()
          resolve(input)
        } else if (ch === '') {
          input = input.slice(0, -1)
        } else {
          input += ch
          process.stdout.write('*')
        }
      })
    } else {
      rl.question(question, answer => { rl.close(); resolve(answer) })
    }
  })
}

async function main() {
  console.log('\n  AlphaAgent — Credentials Setup\n')

  if (fs.existsSync(CREDS_FILE)) {
    const overwrite = await ask('  Credentials already exist. Overwrite? (y/N): ')
    if (overwrite.toLowerCase() !== 'y') { console.log('  Aborted.\n'); process.exit(0) }
  }

  const username = 'alp'
  console.log(`  Username: ${username}`)

  const password = await ask('  Set password: ', true)
  if (!password || password.length < 6) {
    console.error('  ✗  Password must be at least 6 characters.\n')
    process.exit(1)
  }

  const confirm = await ask('  Confirm password: ', true)
  if (password !== confirm) {
    console.error('  ✗  Passwords do not match.\n')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const sessionSecret = crypto.randomBytes(32).toString('hex')

  fs.writeFileSync(
    CREDS_FILE,
    JSON.stringify({ username, passwordHash, sessionSecret }, null, 2),
    { mode: 0o600 }
  )

  console.log('\n  ✓  Credentials saved.\n')
  console.log('  Next steps:')
  console.log('    npm run build')
  console.log('    npm start\n')
}

main().catch(err => { console.error(err); process.exit(1) })

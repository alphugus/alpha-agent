import express from 'express'
import session from 'express-session'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CREDS_FILE = path.join(__dirname, '.credentials')
const DIST_DIR   = path.join(__dirname, 'dist')
const CERTS_DIR  = path.join(__dirname, 'certs')
const PORT       = parseInt(process.env.PORT       || '3000')
const PORT_HTTPS = parseInt(process.env.PORT_HTTPS || '3443')

// ── Credentials ───────────────────────────────────────────────────────────────
if (!fs.existsSync(CREDS_FILE)) {
  console.error('\n  ✗  No credentials found. Run: npm run setup\n')
  process.exit(1)
}
const creds = JSON.parse(fs.readFileSync(CREDS_FILE, 'utf8'))

// ── Express app ───────────────────────────────────────────────────────────────
const app = express()
app.use(express.json())
app.set('trust proxy', 1)

app.use(session({
  secret: creds.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}))

// ── Auth API ──────────────────────────────────────────────────────────────────
app.get('/api/auth', (req, res) => {
  res.json({ ok: !!req.session?.authenticated })
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ ok: false, error: 'Missing fields' })
  if (username !== creds.username) return res.status(401).json({ ok: false, error: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, creds.passwordHash)
  if (!valid) return res.status(401).json({ ok: false, error: 'Invalid credentials' })
  req.session.authenticated = true
  res.json({ ok: true })
})

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }))
})

// ── Static files + SPA fallback ───────────────────────────────────────────────
app.use(express.static(DIST_DIR))
app.get('/{*path}', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')))

// ── Start ─────────────────────────────────────────────────────────────────────
const certFile = path.join(CERTS_DIR, 'server.crt')
const keyFile  = path.join(CERTS_DIR, 'server.key')
const hasCerts = fs.existsSync(certFile) && fs.existsSync(keyFile)

if (hasCerts) {
  const tlsOptions = { cert: fs.readFileSync(certFile), key: fs.readFileSync(keyFile) }
  https.createServer(tlsOptions, app).listen(PORT_HTTPS, '0.0.0.0', () =>
    console.log(`\n  🔒  AlphaAgent → https://0.0.0.0:${PORT_HTTPS}\n`)
  )
  // HTTP → HTTPS redirect
  const redirect = express()
  redirect.get('/{*path}', (req, res) =>
    res.redirect(301, `https://${req.hostname}:${PORT_HTTPS}${req.originalUrl}`)
  )
  http.createServer(redirect).listen(PORT, '0.0.0.0', () =>
    console.log(`      HTTP redirect on port ${PORT}\n`)
  )
} else {
  http.createServer(app).listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🚀  AlphaAgent → http://0.0.0.0:${PORT}`)
    console.log(`      (No TLS certs — HTTP mode. Safe over Tailscale WireGuard.)\n`)
  })
}

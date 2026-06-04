import { useState } from 'react'

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'alp', password }),
      })
      const data = await res.json()
      if (data.ok) {
        onLogin()
      } else {
        setError(data.error || 'Invalid credentials')
        setPassword('')
      }
    } catch {
      setError('Connection error — is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#F8FAFC',
    }}>
      <div style={{
        width: 340,
        background: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 32px rgba(79,70,229,0.08), 0 2px 8px rgba(0,0,0,0.06)',
        padding: '40px 36px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#4F46E5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            fontSize: 24, fontWeight: 700, color: '#FFFFFF',
            fontFamily: 'Arial, Helvetica, sans-serif',
            boxShadow: '0 4px 12px #4F46E540',
          }}>A</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.15em', color: '#4F46E5' }}>
            ALPHA<span style={{ color: '#0F172A' }}>AGENT</span>
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 4 }}>
            Investment Council
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8,
              color: '#0F172A', fontSize: 14,
              fontFamily: "'DM Mono', monospace",
              padding: '11px 14px', outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px #4F46E520' }}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
          />

          {error && (
            <div style={{ fontSize: 11, color: '#EF4444', textAlign: 'center', fontFamily: "'DM Mono', monospace" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              background: (loading || !password) ? '#94A3B8' : '#4F46E5',
              border: 'none', borderRadius: 8,
              color: '#FFFFFF',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 15, letterSpacing: '0.2em',
              padding: '12px', marginTop: 4,
              cursor: (loading || !password) ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              boxShadow: (loading || !password) ? 'none' : '0 2px 8px #4F46E530',
            }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  )
}

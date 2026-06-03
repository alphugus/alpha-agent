import { useState, useEffect, useRef } from 'react'

const CHAIRMAN_COLOR = '#1E293B'

export default function ChatSection({ history, loading, onSend }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  const handleSend = () => {
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div style={{
      marginTop: 10,
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderLeft: `3px solid ${CHAIRMAN_COLOR}`,
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      animation: 'fadeIn 0.4s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid #F1F5F9',
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#FAFBFF',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: CHAIRMAN_COLOR,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#FFFFFF',
          fontFamily: "'DM Mono', monospace",
        }}>C</div>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: '0.1em', color: CHAIRMAN_COLOR }}>
            FOLLOW-UP WITH CHAIRMAN
          </div>
          <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Ask about analysis, scenarios, or risks
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div style={{
        maxHeight: 380,
        overflowY: 'auto',
        padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: '#FDFDFF',
      }}>
        {history.length === 0 && (
          <div style={{ fontSize: 11, color: '#CBD5E1', textAlign: 'center', padding: '16px 0', letterSpacing: '0.05em' }}>
            The council record is open. What would you like to explore?
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#94A3B8', marginBottom: 4, fontWeight: 600,
            }}>
              {msg.role === 'user' ? 'YOU' : 'CHAIRMAN'}
            </div>
            <div style={{
              maxWidth: '88%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              fontSize: 12, lineHeight: 1.7,
              fontFamily: "'DM Mono', monospace",
              whiteSpace: 'pre-wrap',
              background: msg.role === 'user' ? '#EEF2FF' : '#F8FAFC',
              color: msg.role === 'user' ? '#3730A3' : '#334155',
              border: msg.role === 'user' ? '1px solid #C7D2FE' : '1px solid #F1F5F9',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 4, fontWeight: 600 }}>
              CHAIRMAN
            </div>
            <div style={{
              padding: '10px 14px', borderRadius: '10px 10px 10px 2px',
              border: '1px solid #F1F5F9', background: '#F8FAFC',
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#CBD5E1',
                  animation: `pulse 1s ease infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 0,
        borderTop: '1px solid #F1F5F9',
        background: '#FFFFFF',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask the Chairman..."
          disabled={loading}
          style={{
            flex: 1, background: 'transparent',
            border: 'none', outline: 'none',
            padding: '13px 16px',
            fontSize: 12, fontFamily: "'DM Mono', monospace",
            color: '#0F172A',
            opacity: loading ? 0.5 : 1,
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            background: (loading || !input.trim()) ? 'transparent' : '#4F46E5',
            border: 'none',
            borderLeft: '1px solid #F1F5F9',
            padding: '0 18px',
            margin: 6, marginLeft: 0,
            borderRadius: '0 6px 6px 0',
            color: (loading || !input.trim()) ? '#CBD5E1' : '#FFFFFF',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 13, letterSpacing: '0.15em',
            cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          SEND
        </button>
      </div>
    </div>
  )
}

import { META } from '../constants/analysts'

function colorizeOutput(text, color) {
  return text.split('\n').map((line, i) => {
    if (/^[A-Z][A-Z\s/]+:/.test(line)) {
      return <span key={i} style={{ color }}>{line}{'\n'}</span>
    }
    return <span key={i} style={{ color: '#b0b0c8' }}>{line}{'\n'}</span>
  })
}

export default function AnalystCard({ name, state }) {
  const m = META[name]
  const { status, output } = state
  const isChairman = name === 'Chairman'
  const isLoading = status === 'loading'
  const isDone = status === 'done'

  const borderColor = isDone ? m.color + '66'
    : isLoading ? m.color
    : m.color + '44'

  const boxShadow = isLoading ? `0 0 20px ${m.color}33` : 'none'

  const avatarBg = (isLoading || isDone) ? m.color : '#1e1e2e'
  const avatarColor = (isLoading || isDone) ? '#0a0a12' : '#3a3a5a'
  const nameColor = (isLoading || isDone) ? m.color : '#3a3a5a'
  const roleColor = (isLoading || isDone) ? m.color + '99' : '#2a2a4a'

  const statusText = isDone ? 'COMPLETE' : isLoading ? 'ANALYZING' : 'QUEUED'
  const statusColor = isDone ? '#4CAF50' : isLoading ? m.color : '#2a2a4a'

  return (
    <div style={{
      background: isChairman ? 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)' : '#0f0f1a',
      border: `1px solid ${borderColor}`,
      borderRadius: 2,
      padding: 24,
      marginBottom: 2,
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
      boxShadow,
    }}>
      {/* Scan bar */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 2,
          width: '100%',
          background: `linear-gradient(90deg,transparent,${m.color},transparent)`,
          animation: 'scan 1.5s linear infinite',
        }} />
      )}

      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: '0.05em',
          flexShrink: 0,
          background: avatarBg,
          color: avatarColor,
          transition: 'background 0.4s ease',
        }}>
          {m.initial.toUpperCase()}
        </div>
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 18,
            letterSpacing: '0.12em',
            lineHeight: 1,
            color: nameColor,
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: 2,
            color: roleColor,
          }}>
            {m.role}
          </div>
        </div>
        <div style={{
          marginLeft: 'auto',
          fontSize: 10,
          letterSpacing: '0.1em',
          color: statusColor,
          animation: isLoading ? 'pulse 1s ease infinite' : 'none',
        }}>
          {statusText}
        </div>
      </div>

      {/* Skeleton while loading */}
      {isLoading && (
        <div style={{
          fontSize: 12,
          paddingTop: 16,
          borderTop: `1px solid ${m.color}22`,
        }}>
          {['░░░░░░░░░░░░░░░░', '░░░░░░░░░', '░░░░░░░░░░░░░'].map((s, i) => (
            <div key={i} style={{ opacity: 0.5, marginBottom: 6, color: '#2a2a4a' }}>{s}</div>
          ))}
        </div>
      )}

      {/* Output */}
      {isDone && output && (
        <div style={{
          fontSize: 12,
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          borderTop: `1px solid ${m.color}22`,
          paddingTop: 16,
          fontFamily: "'DM Mono', monospace",
        }}>
          {colorizeOutput(output, m.color)}
        </div>
      )}
    </div>
  )
}

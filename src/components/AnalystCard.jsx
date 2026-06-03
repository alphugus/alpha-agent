import { META } from '../constants/analysts'

function colorizeOutput(text, color) {
  return text.split('\n').map((line, i) => {
    if (/^[A-Z][A-Z\s/]+:/.test(line)) {
      const colon = line.indexOf(':')
      return (
        <span key={i}>
          <span style={{ color, fontWeight: 600 }}>{line.slice(0, colon + 1)}</span>
          <span style={{ color: '#334155' }}>{line.slice(colon + 1)}</span>
          {'\n'}
        </span>
      )
    }
    return <span key={i} style={{ color: '#475569' }}>{line}{'\n'}</span>
  })
}

export default function AnalystCard({ name, state }) {
  const m = META[name]
  const { status, output } = state
  const isChairman = name === 'Chairman'
  const isLoading = status === 'loading'
  const isDone = status === 'done'

  const cardShadow = isLoading
    ? `0 4px 12px ${m.color}18, 0 1px 3px rgba(0,0,0,0.06)`
    : isDone
    ? '0 1px 3px rgba(0,0,0,0.06)'
    : '0 1px 2px rgba(0,0,0,0.04)'

  const leftBorder = isLoading || isDone ? `3px solid ${m.color}` : '3px solid #F1F5F9'

  const statusText  = isDone ? 'COMPLETE' : isLoading ? 'ANALYZING' : 'QUEUED'
  const statusColor = isDone ? '#10B981' : isLoading ? m.color : '#CBD5E1'

  return (
    <div style={{
      background: isChairman ? '#FAFBFF' : '#FFFFFF',
      borderRadius: 8,
      border: '1px solid #F1F5F9',
      borderLeft: leftBorder,
      padding: '18px 20px',
      marginBottom: 6,
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease, border-left-color 0.3s ease',
      boxShadow: cardShadow,
    }}>
      {/* Scan bar */}
      {isLoading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, height: 2, width: '100%',
          background: `linear-gradient(90deg, transparent, ${m.color}60, transparent)`,
          animation: 'scan 1.8s linear infinite',
        }} />
      )}

      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isDone ? 14 : 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace",
          letterSpacing: '0.05em', flexShrink: 0,
          background: (isLoading || isDone) ? m.color : '#F1F5F9',
          color: (isLoading || isDone) ? '#FFFFFF' : '#94A3B8',
          transition: 'all 0.3s ease',
        }}>
          {m.initial.toUpperCase()}
        </div>
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 17,
            letterSpacing: '0.1em', lineHeight: 1,
            color: (isLoading || isDone) ? m.color : '#CBD5E1',
            transition: 'color 0.3s ease',
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            marginTop: 2,
            color: (isLoading || isDone) ? m.color + 'aa' : '#E2E8F0',
          }}>
            {m.role}
          </div>
        </div>
        <div style={{
          marginLeft: 'auto', fontSize: 10, letterSpacing: '0.1em',
          color: statusColor, fontWeight: 500,
          animation: isLoading ? 'pulse 1s ease infinite' : 'none',
        }}>
          {statusText}
        </div>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${m.color}15` }}>
          {[80, 50, 65].map((w, i) => (
            <div key={i} style={{
              height: 10, borderRadius: 4, marginBottom: 8,
              width: `${w}%`,
              background: `linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)`,
              backgroundSize: '400px 100%',
              animation: 'shimmer 1.4s ease infinite',
            }} />
          ))}
        </div>
      )}

      {/* Output */}
      {isDone && output && (
        <div style={{
          fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap',
          borderTop: `1px solid ${m.color}18`,
          paddingTop: 14,
          fontFamily: "'DM Mono', monospace",
        }}>
          {colorizeOutput(output, m.color)}
        </div>
      )}
    </div>
  )
}

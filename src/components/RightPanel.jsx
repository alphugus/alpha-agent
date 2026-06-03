import { ANALYST_NAMES, META } from '../constants/analysts'
import AnalystCard from './AnalystCard'

function StandbyView() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 16,
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 48,
        letterSpacing: '0.15em',
        color: '#1a1a2e',
        textAlign: 'center',
      }}>
        COUNCIL STANDING BY
      </div>
      <div style={{
        fontSize: 11,
        color: '#2a2a4a',
        letterSpacing: '0.2em',
        textAlign: 'center',
      }}>
        6 INDEPENDENT ANALYSTS · TIERED ARCHITECTURE · QQQ BENCHMARKED
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {ANALYST_NAMES.map(name => {
          const m = META[name]
          return (
            <div key={name} style={{
              width: 32,
              height: 32,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.1em',
              background: m.color + '22',
              border: `1px solid ${m.color}33`,
              color: m.color + '66',
            }}>
              {m.initial.toUpperCase()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function RightPanel({ analystStates, sessionComplete, isRunning }) {
  const hasStarted = isRunning || sessionComplete ||
    Object.values(analystStates).some(s => s.status !== 'queued')

  return (
    <div style={{ padding: 28, overflowY: 'auto' }}>
      {!hasStarted && <StandbyView />}

      {hasStarted && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {ANALYST_NAMES.map(name => (
            <AnalystCard key={name} name={name} state={analystStates[name]} />
          ))}

          {sessionComplete && (
            <div style={{
              marginTop: 16,
              padding: '16px 24px',
              background: '#0a140a',
              border: '1px solid #2a4a2a',
              borderRadius: 2,
              fontSize: 10,
              letterSpacing: '0.15em',
              color: '#4CAF50',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
            }}>
              SESSION COMPLETE · LOG THIS DECISION AGAINST QQQ BASELINE
            </div>
          )}
        </div>
      )}
    </div>
  )
}

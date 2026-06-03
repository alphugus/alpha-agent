import { META } from '../constants/analysts'

function TierDot({ name, state }) {
  const color = META[name].color
  const bg = state === 'done' ? color
    : state === 'active' ? color + '88'
    : '#2a2a3a'
  const boxShadow = state === 'active' ? `0 0 6px ${color}` : 'none'

  return (
    <div style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: bg,
      boxShadow,
      animation: state === 'active' ? 'pulse 1s ease infinite' : 'none',
      transition: 'background 0.3s ease',
    }} />
  )
}

function TierRow({ label, analysts, note, analystStates }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      background: '#0a0a14',
      border: '1px solid #1a1a2a',
      borderRadius: 2,
    }}>
      <div style={{ fontSize: 9, color: '#3a3a5a', letterSpacing: '0.15em', width: 48 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {analysts.map(name => (
          <TierDot key={name} name={name} state={analystStates[name]?.status === 'done' ? 'done' : analystStates[name]?.status === 'loading' ? 'active' : 'idle'} />
        ))}
      </div>
      <div style={{ fontSize: 9, color: '#2a2a4a', letterSpacing: '0.1em' }}>{note}</div>
    </div>
  )
}

export default function TierStatus({ analystStates }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <TierRow label="TIER 1" analysts={['Marcus', 'Sage']}              note="Parallel · No context"      analystStates={analystStates} />
      <TierRow label="TIER 2" analysts={['Val', 'Mo', 'Vera']}           note="Val+Mo: context · Vera: blind" analystStates={analystStates} />
      <TierRow label="TIER 3" analysts={['Chairman']}                    note="Full synthesis"              analystStates={analystStates} />
    </div>
  )
}

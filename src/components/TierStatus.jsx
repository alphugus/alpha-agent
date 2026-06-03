import { META } from '../constants/analysts'

function TierDot({ name, state }) {
  const color = META[name].color
  const bg = state === 'done' ? color
    : state === 'active' ? color + 'aa'
    : '#E2E8F0'
  const boxShadow = state === 'active' ? `0 0 0 3px ${color}22` : 'none'

  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: bg, boxShadow,
      animation: state === 'active' ? 'pulse 1s ease infinite' : 'none',
      transition: 'all 0.3s ease',
    }} />
  )
}

function TierRow({ label, analysts, note, analystStates }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 12px',
      background: '#FFFFFF',
      border: '1px solid #F1F5F9',
      borderRadius: 6,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.15em', width: 48, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {analysts.map(name => (
          <TierDot key={name} name={name} state={
            analystStates[name]?.status === 'done'    ? 'done'
            : analystStates[name]?.status === 'loading' ? 'active'
            : 'idle'
          } />
        ))}
      </div>
      <div style={{ fontSize: 9, color: '#CBD5E1', letterSpacing: '0.08em' }}>{note}</div>
    </div>
  )
}

export default function TierStatus({ analystStates }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <TierRow label="TIER 1" analysts={['Marcus', 'Sage']}    note="Parallel · No context"         analystStates={analystStates} />
      <TierRow label="TIER 2" analysts={['Val', 'Mo', 'Vera']} note="Val+Mo: context · Vera: blind" analystStates={analystStates} />
      <TierRow label="TIER 3" analysts={['Chairman']}          note="Full synthesis"                analystStates={analystStates} />
    </div>
  )
}

export default function Header() {
  return (
    <div style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 26,
          letterSpacing: '0.18em',
          color: '#4F46E5',
        }}>
          ALPHA<span style={{ color: '#0F172A' }}>AGENT</span>
        </div>
        <div style={{
          fontSize: 10,
          letterSpacing: '0.18em',
          color: '#94A3B8',
          textTransform: 'uppercase',
          borderLeft: '1px solid #E2E8F0',
          paddingLeft: 14,
        }}>
          Investment Council · v0.1
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20, fontSize: 10, letterSpacing: '0.12em', color: '#94A3B8' }}>
        <span>TIER 1: MARCUS · SAGE</span>
        <span>TIER 2: VAL · MO · VERA (BLIND)</span>
        <span>TIER 3: CHAIRMAN</span>
      </div>
    </div>
  )
}

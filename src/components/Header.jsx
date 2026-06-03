export default function Header() {
  return (
    <div style={{
      background: '#09091a',
      borderBottom: '1px solid #1a1a2e',
      padding: '20px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28,
          letterSpacing: '0.2em',
          color: '#C9A84C',
        }}>
          ALPHA<span style={{ color: '#E8E8E8' }}>AGENT</span>
        </div>
        <div style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          color: '#3a3a5a',
          textTransform: 'uppercase',
          borderLeft: '1px solid #2a2a4a',
          paddingLeft: 16,
        }}>
          Investment Council · v0.1
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, fontSize: 10, letterSpacing: '0.15em', color: '#3a3a5a' }}>
        <span>TIER 1: MARCUS · SAGE</span>
        <span>TIER 2: VAL · MO · VERA (BLIND)</span>
        <span>TIER 3: CHAIRMAN</span>
      </div>
    </div>
  )
}

import TierStatus from './TierStatus'

const inputStyle = {
  background: '#0a0a14',
  border: '1px solid #1e1e32',
  borderRadius: 2,
  color: '#c8c8d8',
  fontSize: 11,
  fontFamily: "'DM Mono', monospace",
  padding: '10px 14px',
  width: '100%',
  transition: 'border-color 0.3s ease',
  outline: 'none',
}

const labelStyle = {
  fontSize: 10,
  letterSpacing: '0.2em',
  color: '#4a4a6a',
  textTransform: 'uppercase',
}

export default function LeftPanel({
  apiKey, onApiKeyChange,
  ticker, onTickerChange, onBuildBrief, buildingBrief,
  brief, onBriefChange,
  error, logs,
  running, sessionComplete, newsStatus,
  onConvene, onReset,
  analystStates,
}) {
  const btnLoading = running
  const btnComplete = sessionComplete

  const btnStyle = {
    background: btnComplete ? '#0a1a0a' : btnLoading ? '#1a1a2e' : '#1a1500',
    border: `1px solid ${btnComplete ? '#2a4a2a' : btnLoading ? '#2a2a4a' : '#C9A84C'}`,
    borderRadius: 2,
    color: btnComplete ? '#4CAF50' : btnLoading ? '#3a3a5a' : '#C9A84C',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 16,
    letterSpacing: '0.2em',
    padding: 14,
    cursor: btnLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
  }

  const btnText = btnComplete ? 'RESET SESSION' : btnLoading ? 'COUNCIL IN SESSION...' : 'CONVENE COUNCIL'

  const hasSession = running || sessionComplete ||
    Object.values(analystStates).some(s => s.status !== 'queued')

  return (
    <div style={{
      background: '#09091a',
      borderRight: '1px solid #1a1a2e',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      width: 380,
      flexShrink: 0,
    }}>
      {/* API Key */}
      <div style={labelStyle}>Anthropic API Key</div>
      <input
        type="password"
        value={apiKey}
        onChange={e => onApiKeyChange(e.target.value)}
        placeholder="sk-ant-..."
        style={{
          ...inputStyle,
          borderColor: apiKey.startsWith('sk-') ? '#C9A84C66' : '#1e1e32',
        }}
        onFocus={e => e.target.style.borderColor = '#C9A84C44'}
        onBlur={e => e.target.style.borderColor = apiKey.startsWith('sk-') ? '#C9A84C66' : '#1e1e32'}
      />
      {apiKey.startsWith('sk-') && (
        <div style={{ fontSize: 9, letterSpacing: '0.15em', color: '#C9A84C55', textTransform: 'uppercase', marginTop: -8 }}>
          ✓ Saved in browser storage
        </div>
      )}

      {/* Ticker → auto-build brief */}
      <div style={labelStyle}>Build Brief From Ticker</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={ticker}
          onChange={e => onTickerChange(e.target.value.toUpperCase())}
          placeholder="GOOG"
          maxLength={10}
          style={{ ...inputStyle, width: 90, flexShrink: 0, textTransform: 'uppercase' }}
          onKeyDown={e => e.key === 'Enter' && onBuildBrief()}
        />
        <button
          onClick={onBuildBrief}
          disabled={buildingBrief || !ticker.trim() || !apiKey.startsWith('sk-')}
          style={{
            flex: 1,
            background: buildingBrief ? '#1a1a2e' : '#0d0d1e',
            border: '1px solid #2a2a4a',
            borderRadius: 2,
            color: buildingBrief ? '#3a3a5a' : '#7a7ab8',
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.15em',
            cursor: buildingBrief ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {buildingBrief ? 'SEARCHING...' : 'BUILD BRIEF'}
        </button>
      </div>

      {/* Brief */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={labelStyle}>Investment Brief</div>
      </div>
      <textarea
        value={brief}
        onChange={e => onBriefChange(e.target.value)}
        style={{
          ...inputStyle,
          minHeight: 280,
          resize: 'none',
          lineHeight: 1.7,
        }}
        onFocus={e => e.target.style.borderColor = '#C9A84C44'}
        onBlur={e => e.target.style.borderColor = '#1e1e32'}
      />
      <div style={{ fontSize: 9, letterSpacing: '0.15em', color: '#2a2a4a', textTransform: 'uppercase' }}>
        Edit brief or enter ticker above to auto-populate
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#1a0a0a',
          border: '1px solid #4a1a1a',
          borderRadius: 2,
          padding: 12,
          fontSize: 11,
          color: '#c87a7a',
          wordBreak: 'break-word',
        }}>
          {error}
        </div>
      )}

      {/* Debug log */}
      {logs.length > 0 && (
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #1a1a2a',
          borderRadius: 2,
          padding: 10,
          fontSize: 10,
          color: '#3a3a6a',
          maxHeight: 100,
          overflowY: 'auto',
          fontFamily: "'DM Mono', monospace",
        }}>
          {logs.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      {/* Convene button */}
      <button
        style={btnStyle}
        onClick={btnComplete ? onReset : onConvene}
        disabled={btnLoading}
      >
        {btnText}
      </button>

      {/* Tier status */}
      {hasSession && (
        <>
          {newsStatus && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', background: '#0a0a14',
              border: '1px solid #1a1a2a', borderRadius: 2,
            }}>
              <div style={{ fontSize: 9, color: '#3a3a5a', letterSpacing: '0.15em', width: 48 }}>NEWS</div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: newsStatus === 'done' ? '#C9A84C'
                  : newsStatus === 'error' ? '#c87a7a'
                  : '#C9A84C88',
                boxShadow: newsStatus === 'loading' ? '0 0 6px #C9A84C' : 'none',
                animation: newsStatus === 'loading' ? 'pulse 1s ease infinite' : 'none',
              }} />
              <div style={{ fontSize: 9, color: '#2a2a4a', letterSpacing: '0.1em' }}>
                {newsStatus === 'loading' ? 'Fetching...'
                  : newsStatus === 'done' ? 'Injected into all analysts'
                  : 'Fetch failed — proceeding'}
              </div>
            </div>
          )}
          <TierStatus analystStates={analystStates} />
        </>
      )}
    </div>
  )
}

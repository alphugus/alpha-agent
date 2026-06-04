import TierStatus from './TierStatus'

const inputStyle = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 6,
  color: '#0F172A',
  fontSize: 11,
  fontFamily: "'DM Mono', monospace",
  padding: '9px 12px',
  width: '100%',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  outline: 'none',
}

const labelStyle = {
  fontSize: 10,
  letterSpacing: '0.16em',
  color: '#64748B',
  textTransform: 'uppercase',
  fontWeight: 600,
}

export default function LeftPanel({
  apiKey, onApiKeyChange,
  ticker, onTickerChange, isPreIPO, onTogglePreIPO, onBuildBrief, buildingBrief,
  brief, onBriefChange,
  error, logs,
  running, sessionComplete, newsStatus,
  onConvene, onReset,
  analystStates,
}) {
  const btnLoading  = running || buildingBrief
  const btnComplete = sessionComplete

  const btnStyle = {
    background: btnComplete ? '#059669' : btnLoading ? '#94A3B8' : '#4F46E5',
    border: 'none',
    borderRadius: 7,
    color: '#FFFFFF',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 15,
    letterSpacing: '0.2em',
    padding: '13px 14px',
    cursor: btnLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    boxShadow: btnLoading ? 'none' : btnComplete ? '0 2px 8px #05996930' : '0 2px 8px #4F46E530',
  }

  const btnText = btnComplete ? 'RESET SESSION'
    : running ? 'COUNCIL IN SESSION...'
    : buildingBrief ? 'BUILDING BRIEF...'
    : 'CONVENE COUNCIL'

  const hasSession = running || sessionComplete ||
    Object.values(analystStates).some(s => s.status !== 'queued')

  const focusStyle = { borderColor: '#4F46E5', boxShadow: '0 0 0 3px #4F46E520' }

  return (
    <div style={{
      background: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: 360,
      flexShrink: 0,
      overflowY: 'auto',
      boxShadow: '1px 0 4px rgba(0,0,0,0.04)',
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
          borderColor: apiKey.startsWith('sk-') ? '#10B981' : '#E2E8F0',
          boxShadow: apiKey.startsWith('sk-') ? '0 0 0 3px #10B98118' : 'none',
        }}
        onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px #4F46E520' }}
        onBlur={e => { e.target.style.borderColor = apiKey.startsWith('sk-') ? '#10B981' : '#E2E8F0'; e.target.style.boxShadow = apiKey.startsWith('sk-') ? '0 0 0 3px #10B98118' : 'none' }}
      />
      {apiKey.startsWith('sk-') && (
        <div style={{ fontSize: 10, color: '#10B981', marginTop: -6, letterSpacing: '0.05em' }}>
          ✓ Key saved in browser storage
        </div>
      )}

      <div style={{ borderTop: '1px solid #F1F5F9', margin: '2px 0' }} />

      {/* Ticker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={labelStyle}>Build Brief From Ticker</div>
        <button
          onClick={onTogglePreIPO}
          title="Toggle Pre-IPO mode — searches S-1, offer price, underwriters"
          style={{
            background: isPreIPO ? '#F59E0B' : '#F8FAFC',
            border: `1px solid ${isPreIPO ? '#F59E0B' : '#E2E8F0'}`,
            borderRadius: 10,
            color: isPreIPO ? '#FFFFFF' : '#94A3B8',
            fontSize: 9, letterSpacing: '0.14em', fontWeight: 700,
            padding: '3px 8px',
            cursor: 'pointer',
            fontFamily: "'DM Mono', monospace",
            transition: 'all 0.2s ease',
            boxShadow: isPreIPO ? '0 2px 6px #F59E0B40' : 'none',
          }}
        >
          PRE-IPO {isPreIPO ? '✓' : ''}
        </button>
      </div>

      {isPreIPO && (
        <div style={{
          fontSize: 10, color: '#92400E', background: '#FFFBEB',
          border: '1px solid #FDE68A', borderRadius: 6,
          padding: '8px 10px', lineHeight: 1.5,
          fontFamily: "'DM Mono', monospace",
          marginTop: -4,
        }}>
          Pre-IPO mode: searches S-1/F-1, offer price range, underwriters & deal sentiment. Enter ticker or company name.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={ticker}
          onChange={e => onTickerChange(e.target.value.toUpperCase())}
          placeholder={isPreIPO ? 'SPCX or SpaceX' : 'GOOG'}
          maxLength={20}
          style={{ ...inputStyle, width: 80, flexShrink: 0, textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.1em' }}
          onKeyDown={e => e.key === 'Enter' && onBuildBrief()}
          onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px #4F46E520' }}
          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
        />
        <button
          onClick={onBuildBrief}
          disabled={buildingBrief || !ticker.trim() || !apiKey.startsWith('sk-')}
          style={{
            flex: 1,
            background: (buildingBrief || !ticker.trim() || !apiKey.startsWith('sk-')) ? '#F8FAFC'
              : isPreIPO ? '#FFFBEB' : '#EEF2FF',
            border: `1px solid ${isPreIPO ? '#FDE68A' : '#E2E8F0'}`,
            borderRadius: 6,
            color: (buildingBrief || !ticker.trim() || !apiKey.startsWith('sk-')) ? '#CBD5E1'
              : isPreIPO ? '#92400E' : '#4F46E5',
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.12em',
            cursor: (buildingBrief || !ticker.trim() || !apiKey.startsWith('sk-')) ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          {buildingBrief ? 'SEARCHING...' : 'BUILD BRIEF'}
        </button>
      </div>

      {/* Brief */}
      <div style={labelStyle}>Investment Brief</div>
      <textarea
        value={brief}
        onChange={e => onBriefChange(e.target.value)}
        placeholder={`Enter a brief or use the ticker builder above.\n\nINVESTMENT BRIEF: TICKER — Month Year — ~$price\n\nSITUATION: ...\nCONSENSUS: ...\nFINANCIALS: ...\nWHAT CONSENSUS MISSES:\n- ...\nQUESTION: Buy TICKER at current price vs QQQ?`}
        style={{
          ...inputStyle,
          minHeight: 240,
          resize: 'none',
          lineHeight: 1.7,
        }}
        onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px #4F46E520' }}
        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
      />

      {/* Error */}
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 6, padding: '10px 12px',
          fontSize: 11, color: '#DC2626', lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {/* Debug log */}
      {logs.length > 0 && (
        <div style={{
          background: '#F8FAFC', border: '1px solid #F1F5F9',
          borderRadius: 6, padding: 10,
          fontSize: 10, color: '#94A3B8',
          maxHeight: 90, overflowY: 'auto',
          fontFamily: "'DM Mono', monospace",
          lineHeight: 1.6,
        }}>
          {logs.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      {/* Convene button */}
      <button style={btnStyle} onClick={btnComplete ? onReset : onConvene} disabled={btnLoading}>
        {btnText}
      </button>

      {/* Session progress */}
      {hasSession && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2 }}>
          {newsStatus && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 12px',
              background: '#FFFFFF', border: '1px solid #F1F5F9',
              borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.15em', width: 48, textTransform: 'uppercase' }}>NEWS</div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: newsStatus === 'done' || newsStatus === 'skipped' ? '#4F46E5'
                  : newsStatus === 'error' ? '#EF4444'
                  : '#A5B4FC',
                boxShadow: newsStatus === 'loading' ? '0 0 0 3px #4F46E520' : 'none',
                animation: newsStatus === 'loading' ? 'pulse 1s ease infinite' : 'none',
              }} />
              <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.08em' }}>
                {newsStatus === 'loading'   ? 'Fetching...'
                  : newsStatus === 'done'   ? 'Injected into all analysts'
                  : newsStatus === 'skipped' ? 'In brief — skipped'
                  : 'Fetch failed — proceeding'}
              </div>
            </div>
          )}
          <TierStatus analystStates={analystStates} />
        </div>
      )}
    </div>
  )
}

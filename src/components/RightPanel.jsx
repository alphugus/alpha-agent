import { ANALYST_NAMES, META } from '../constants/analysts'
import AnalystCard from './AnalystCard'
import ChatSection from './ChatSection'

const ANALYST_DESC = {
  Marcus:   'Reads the macro tape — rates, liquidity, cycle positioning.',
  Sage:     'Maps sector rotation and relative strength vs. peers.',
  Val:      'Stress-tests the business: cash runway, margins, growth quality.',
  Mo:       'Reads price action and institutional accumulation signals.',
  Vera:     'Runs blind. Finds what the consensus is getting wrong.',
  Chairman: 'Synthesizes all five. Issues the final verdict.',
}

const TIER_INFO = [
  { label: 'TIER 1', names: ['Marcus', 'Sage'], note: 'Run in parallel with no prior context — pure independent reads.' },
  { label: 'TIER 2', names: ['Val', 'Mo', 'Vera'], note: 'Val & Mo receive Tier 1 context. Vera stays fully blind.' },
  { label: 'TIER 3', names: ['Chairman'], note: 'Synthesizes all five reports into a final decision.' },
]

function StandbyView() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 0', animation: 'fadeIn 0.5s ease' }}>

      {/* Hero */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: '0.25em', color: '#4F46E5', marginBottom: 10, textTransform: 'uppercase' }}>
          AlphaAgent · Investment Council
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.08em', color: '#0F172A', lineHeight: 1.1, marginBottom: 14 }}>
          Six AI analysts. One decision.<br />Beat the benchmark.
        </h1>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, fontFamily: "'DM Mono', monospace", maxWidth: 580 }}>
          AlphaAgent convenes a structured panel of six independent AI analysts — each with a distinct lens — to evaluate a stock before deploying capital. Every session produces a conviction-scored Buy/Hold/Pass decision benchmarked against QQQ.
        </p>
      </div>

      {/* Analysts */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
          The Council
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ANALYST_NAMES.map(name => {
            const m = META[name]
            const isChairman = name === 'Chairman'
            return (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                background: '#FFFFFF',
                border: '1px solid #F1F5F9',
                borderLeft: `3px solid ${m.color}`,
                borderRadius: 7,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                  background: m.color + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: m.color,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {m.initial.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: '0.1em', color: m.color }}>{name}</span>
                    <span style={{ fontSize: 10, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.role}</span>
                    {isChairman && <span style={{ fontSize: 9, background: '#F1F5F9', color: '#64748B', padding: '1px 6px', borderRadius: 10, letterSpacing: '0.08em' }}>FINAL VOTE</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 1, fontFamily: "'DM Mono', monospace" }}>{ANALYST_DESC[name]}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tier architecture */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
          Tiered Architecture
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TIER_INFO.map(({ label, names, note }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 14px',
              background: '#FFFFFF', border: '1px solid #F1F5F9',
              borderRadius: 7, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4F46E5', letterSpacing: '0.15em', width: 52, flexShrink: 0 }}>{label}</div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {names.map(n => (
                  <div key={n} style={{
                    padding: '2px 8px', borderRadius: 10,
                    background: META[n].color + '12',
                    border: `1px solid ${META[n].color}25`,
                    fontSize: 10, color: META[n].color, fontWeight: 600,
                    fontFamily: "'DM Mono', monospace",
                  }}>{n}</div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', fontFamily: "'DM Mono', monospace" }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How to use */}
      <div style={{
        padding: '16px 18px',
        background: '#EEF2FF', border: '1px solid #C7D2FE',
        borderRadius: 8, fontSize: 11, color: '#3730A3',
        fontFamily: "'DM Mono', monospace", lineHeight: 1.8,
      }}>
        <span style={{ fontWeight: 700, letterSpacing: '0.08em' }}>TO START: </span>
        Enter your Anthropic API key → type a ticker and click BUILD BRIEF to auto-generate an investment brief with live data → click CONVENE COUNCIL. After the decision, follow up with the Chairman directly.
      </div>

      {/* Standby label */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: '0.14em', color: '#E2E8F0' }}>
          COUNCIL STANDING BY
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {ANALYST_NAMES.map(name => {
            const m = META[name]
            return (
              <div key={name} style={{
                width: 30, height: 30, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 700,
                background: m.color + '10', color: m.color + '50',
                border: `1px solid ${m.color}15`,
              }}>
                {m.initial.toUpperCase()}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default function RightPanel({ analystStates, sessionComplete, isRunning, chatHistory, chatLoading, onSendFollowUp }) {
  const hasStarted = isRunning || sessionComplete ||
    Object.values(analystStates).some(s => s.status !== 'queued')

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, background: '#F8FAFC' }}>
      {!hasStarted && <StandbyView />}

      {hasStarted && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {ANALYST_NAMES.map(name => (
            <AnalystCard key={name} name={name} state={analystStates[name]} />
          ))}

          {sessionComplete && (
            <>
              <div style={{
                marginTop: 8, padding: '14px 20px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 8, fontSize: 10, letterSpacing: '0.15em',
                color: '#059669', textAlign: 'center',
                fontWeight: 600,
              }}>
                SESSION COMPLETE · LOG THIS DECISION AGAINST QQQ BASELINE
              </div>
              <ChatSection
                history={chatHistory}
                loading={chatLoading}
                onSend={onSendFollowUp}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

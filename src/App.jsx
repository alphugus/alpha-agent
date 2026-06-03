import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import { ANALYST_NAMES, DEFAULT_BRIEF } from './constants/analysts'
import {
  callAnalyst, buildBriefFromTicker, fetchCurrentNews,
  buildAnalystInput, buildTier2Input, buildChairmanInput,
  compressOutput,
} from './utils/api'

function freshState() {
  return Object.fromEntries(ANALYST_NAMES.map(name => [name, { status: 'queued', output: '' }]))
}

function extractTicker(brief, tickerField) {
  if (tickerField.trim()) return tickerField.trim().toUpperCase()
  const m = brief.match(/INVESTMENT BRIEF:\s*([A-Z]{1,6})[\s—\-\(]/i)
  return m ? m[1].toUpperCase() : ''
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('aa_api_key') || '')
  const [ticker, setTicker] = useState('')
  const [brief, setBrief] = useState(DEFAULT_BRIEF)
  const [analystStates, setAnalystStates] = useState(freshState)
  const [running, setRunning] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [buildingBrief, setBuildingBrief] = useState(false)
  const [newsStatus, setNewsStatus] = useState('') // '' | 'loading' | 'done' | 'error'
  const [error, setError] = useState('')
  const [logs, setLogs] = useState([])

  const runningRef = useRef(false)

  const log = useCallback((msg) => {
    const t = new Date().toISOString().slice(11, 19)
    setLogs(prev => [...prev, `${t} ${msg}`])
  }, [])

  const setAnalyst = useCallback((name, patch) => {
    setAnalystStates(prev => ({ ...prev, [name]: { ...prev[name], ...patch } }))
  }, [])

  const handleBuildBrief = useCallback(async () => {
    if (!ticker.trim() || !apiKey.startsWith('sk-')) return
    setBuildingBrief(true)
    setError('')
    log(`Building brief for ${ticker.toUpperCase()}...`)
    try {
      const result = await buildBriefFromTicker(ticker, apiKey)
      setBrief(result)
      log(`Brief ready for ${ticker.toUpperCase()}`)
    } catch (err) {
      setError(err.message)
      log('Brief build failed: ' + err.message)
    } finally {
      setBuildingBrief(false)
    }
  }, [ticker, apiKey, log])

  const handleConvene = useCallback(async () => {
    if (runningRef.current) return
    if (!apiKey.startsWith('sk-')) { setError('Enter your Anthropic API key first.'); return }
    if (!brief.trim()) { setError('Investment brief is empty.'); return }

    runningRef.current = true
    setRunning(true)
    setSessionComplete(false)
    setError('')
    setLogs([])
    setNewsStatus('')
    setAnalystStates(freshState())

    try {
      // ── News fetch — one web_search call, injected into all analysts ──────────
      const sym = extractTicker(brief, ticker)
      let news = ''
      if (sym) {
        setNewsStatus('loading')
        log(`Fetching current news for ${sym}...`)
        try {
          news = await fetchCurrentNews(sym, apiKey)
          setNewsStatus('done')
          log(`News fetched for ${sym}`)
        } catch (err) {
          setNewsStatus('error')
          log(`News fetch failed (${err.message}) — proceeding without`)
        }
      }

      // ── Tier 1: Marcus + Sage — full brief + news, no prior context ───────────
      setAnalyst('Marcus', { status: 'loading' })
      setAnalyst('Sage',   { status: 'loading' })
      log('Tier 1 starting...')

      const [marcusOut, sageOut] = await Promise.all([
        callAnalyst('Marcus', buildAnalystInput('Marcus', brief, news), apiKey),
        callAnalyst('Sage',   buildAnalystInput('Sage',   brief, news), apiKey),
      ])

      setAnalyst('Marcus', { status: 'done', output: marcusOut })
      setAnalyst('Sage',   { status: 'done', output: sageOut })
      log('Tier 1 complete')

      // Compress Tier 1 to verdict fields only before passing forward
      const ctx1 = `MARCUS:\n${compressOutput(marcusOut)}\n\nSAGE:\n${compressOutput(sageOut)}`

      // ── Tier 2: Val + Mo (compressed brief + T1 context), Vera (blind) ────────
      setAnalyst('Val',  { status: 'loading' })
      setAnalyst('Mo',   { status: 'loading' })
      setAnalyst('Vera', { status: 'loading' })
      log('Tier 2 starting...')

      const [valOut, moOut, veraOut] = await Promise.all([
        callAnalyst('Val',  buildTier2Input('Val',  brief, news, ctx1), apiKey),
        callAnalyst('Mo',   buildTier2Input('Mo',   brief, news, ctx1), apiKey),
        callAnalyst('Vera', buildTier2Input('Vera', brief, news, null), apiKey),
      ])

      setAnalyst('Val',  { status: 'done', output: valOut })
      setAnalyst('Mo',   { status: 'done', output: moOut })
      setAnalyst('Vera', { status: 'done', output: veraOut })
      log('Tier 2 complete')

      // Compress all 5 for Chairman
      const ctx2 = [
        ctx1,
        `VAL:\n${compressOutput(valOut)}`,
        `MO:\n${compressOutput(moOut)}`,
        `VERA:\n${compressOutput(veraOut)}`,
      ].join('\n\n')

      // ── Tier 3: Chairman — brief header + question + all compressed outputs ───
      setAnalyst('Chairman', { status: 'loading' })
      log('Tier 3 starting...')

      const chairOut = await callAnalyst('Chairman', buildChairmanInput(brief, ctx2), apiKey)
      setAnalyst('Chairman', { status: 'done', output: chairOut })
      log('Session complete')

      setSessionComplete(true)
    } catch (err) {
      setError(err.message)
      log('FAILED: ' + err.message)
      setAnalystStates(prev => {
        const next = { ...prev }
        for (const name of ANALYST_NAMES) {
          if (next[name].status === 'loading') next[name] = { ...next[name], status: 'queued' }
        }
        return next
      })
    } finally {
      runningRef.current = false
      setRunning(false)
    }
  }, [apiKey, brief, ticker, log, setAnalyst])

  const handleReset = useCallback(() => {
    runningRef.current = false
    setRunning(false)
    setSessionComplete(false)
    setNewsStatus('')
    setError('')
    setLogs([])
    setAnalystStates(freshState())
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <LeftPanel
          apiKey={apiKey}
          onApiKeyChange={key => { setApiKey(key); localStorage.setItem('aa_api_key', key) }}
          ticker={ticker}               onTickerChange={setTicker}
          onBuildBrief={handleBuildBrief} buildingBrief={buildingBrief}
          brief={brief}                 onBriefChange={setBrief}
          error={error}
          logs={logs}
          running={running}
          sessionComplete={sessionComplete}
          newsStatus={newsStatus}
          onConvene={handleConvene}
          onReset={handleReset}
          analystStates={analystStates}
        />
        <RightPanel
          analystStates={analystStates}
          sessionComplete={sessionComplete}
          isRunning={running}
        />
      </div>
    </div>
  )
}

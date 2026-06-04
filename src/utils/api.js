import { PROMPTS } from '../constants/analysts'

const API_URL = 'https://api.anthropic.com/v1/messages'

// Tuned per analyst — structured responses are short
const MAX_TOKENS = {
  Marcus: 400, Sage: 400, Val: 450,
  Mo: 400, Vera: 450, Chairman: 900,
  news: 300, brief: 1500,
}

function makeHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  }
}

function extractText(content) {
  return content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n')
    .replace(/\*\*|__/g, '')   // strip markdown bold markers that break field-label parsing
    .trim()
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchWithRetry(url, options, label, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options)
    const data = await res.json()
    if (data.error?.type === 'rate_limit_error') {
      if (attempt === maxRetries) throw new Error(`${label}: rate limit — try again in a minute`)
      await sleep(20000 * (attempt + 1))
      continue
    }
    if (data.error) throw new Error(`${label}: ${data.error.message}`)
    return data
  }
}

// ─── Brief builder ────────────────────────────────────────────────────────────
export async function buildBriefFromTicker(ticker, apiKey) {
  const sym = ticker.toUpperCase()
  const data = await fetchWithRetry(API_URL, {
    method: 'POST',
    headers: makeHeaders(apiKey),
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: MAX_TOKENS.brief,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for current investment info on ${sym} and write a brief in EXACTLY this format (no other text):

INVESTMENT BRIEF: ${sym} — [Month Year] — [price with ~]

SITUATION: [2-3 sentences]

CONSENSUS: [1-2 sentences on analyst consensus]

FINANCIALS: [revenue trend, margins, cash, debt — key numbers only]

WHAT CONSENSUS MISSES:
- [overlooked positive 1]
- [overlooked positive 2]
- [overlooked positive 3]

MACRO: [1 sentence on macro backdrop]

QUESTION: Buy ${sym} at current price for high-conviction growth portfolio vs QQQ benchmark?`,
      }],
    }),
  }, 'Brief builder')

  const text = extractText(data.content)
  if (!text) throw new Error('Brief builder: no text in response')
  return text
}

// ─── News fetch — ONE call per session, shared with all analysts ───────────────
export async function fetchCurrentNews(ticker, apiKey) {
  const sym = ticker.toUpperCase()
  const data = await fetchWithRetry(API_URL, {
    method: 'POST',
    headers: makeHeaders(apiKey),
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: MAX_TOKENS.news,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for the latest news about ${sym} stock (past 2 weeks). Return ONLY this format, nothing else:

CURRENT NEWS: ${sym} — [today's date]
• [headline — key fact]
• [headline — key fact]
• [headline — key fact]
• [headline — key fact]
• [headline — key fact]`,
      }],
    }),
  }, 'News fetch')

  const text = extractText(data.content)
  if (!text) throw new Error('News fetch: no text in response')
  return text
}

// ─── Context helpers ──────────────────────────────────────────────────────────

// Keep only labeled field lines (REGIME: ..., KEY RISK: ...) — drops prose
export function compressOutput(text) {
  return text.split('\n').filter(l => /^[A-Z][A-Z\s/]+:/.test(l)).join('\n')
}

function briefHeader(brief) {
  return brief.split('\n').find(l => l.trim()) || ''
}
function briefQuestion(brief) {
  return brief.split('\n').find(l => l.startsWith('QUESTION:')) || ''
}
function briefFinancials(brief) {
  const m = brief.match(/FINANCIALS[^:]*:([\s\S]*?)(?=\n\n[A-Z]|$)/)
  return m ? `FINANCIALS:${m[1].trimEnd()}` : ''
}

// Build the user message each analyst receives
export function buildAnalystInput(name, fullBrief, news) {
  // Tier 1 (no prior context) and Vera (always blind) get the full brief + news
  if (name === 'Marcus' || name === 'Sage' || name === 'Vera') {
    return `BRIEF:\n${fullBrief}\n\n${news}`
  }
  // Should not be called for Chairman or Tier 2 without priorContext — see callCouncil
  return `BRIEF:\n${fullBrief}\n\n${news}`
}

export function buildTier2Input(name, fullBrief, news, tier1Context) {
  if (name === 'Vera') {
    // Vera is blind — full brief, no prior context
    return `BRIEF:\n${fullBrief}\n\n${news}`
  }
  // Val + Mo: compressed brief (header + financials + question) + news + compressed T1
  const compact = [briefHeader(fullBrief), briefFinancials(fullBrief), briefQuestion(fullBrief)]
    .filter(Boolean).join('\n')
  return `BRIEF (SUMMARY):\n${compact}\n\n${news}\n\nPRIOR ANALYSIS:\n${tier1Context}`
}

export function buildChairmanInput(fullBrief, allContext) {
  // Chairman: brief header + question only — full detail is in the analyst outputs
  const compact = `${briefHeader(fullBrief)}\n${briefQuestion(fullBrief)}`
  return `${compact}\n\nANALYST REPORTS:\n${allContext}`
}

// ─── Chairman follow-up conversation ─────────────────────────────────────────
export async function callChairmanFollowUp(chairmanInput, initialOutput, history, newMessage, apiKey) {
  const messages = [
    { role: 'user',      content: chairmanInput  },
    { role: 'assistant', content: initialOutput  },
    ...history,
    { role: 'user',      content: newMessage     },
  ]

  const data = await fetchWithRetry(API_URL, {
    method: 'POST',
    headers: makeHeaders(apiKey),
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: [{ type: 'text', text: PROMPTS.ChairmanFollowUp, cache_control: { type: 'ephemeral' } }],
      messages,
    }),
  }, 'Chairman follow-up')

  const text = extractText(data.content)
  if (!text) throw new Error('Chairman follow-up: no text in response')
  return text
}

// ─── Analyst call — no web_search (news is pre-injected) ─────────────────────
export async function callAnalyst(name, userMsg, apiKey) {
  const data = await fetchWithRetry(API_URL, {
    method: 'POST',
    headers: makeHeaders(apiKey),
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: MAX_TOKENS[name] || 300,
      // Cache the system prompt — same across calls within a session
      system: [{ type: 'text', text: PROMPTS[name], cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMsg }],
    }),
  }, name)

  const text = extractText(data.content)
  if (!text) throw new Error(`${name}: no text in response`)
  return text
}

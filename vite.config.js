import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SITE = 'https://hirewilliam.com'

// Routed pages inside the React app that need their own URL on GitHub Pages.
// Pages has no SPA fallback, so each route gets its own copy of index.html.
// Each copy carries the page's own <head> and a static, crawlable version of
// the view's copy inside <div id="root">, which React replaces on mount.
//
//   route:   the URL path (dist/<route>/index.html)
//   source:  file holding the page's meta description, JSON-LD and static copy
//   title:   taken from PAGE_TITLES in src/App.jsx so the two never diverge
const ROUTED_PAGES = [
  { route: 'recruitment', source: 'seo/recruitment-static.html' },
]

// JSON-LD nodes that describe the site as a whole and may stay on every routed
// page. Everything else in the homepage head is homepage-only (reviews, FAQs,
// Article, ProfessionalService catalog) and is dropped from routed copies.
const SITEWIDE_JSONLD_TYPES = new Set(['Organization', 'WebSite'])

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

// Replace exactly one occurrence, or fail the build. A silent miss would ship
// a routed page that still carries the homepage title or canonical.
function replaceOnce(html, pattern, replacement, what) {
  const matches = html.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')) || []
  if (matches.length !== 1) {
    throw new Error(`routed-pages: expected exactly one ${what} in dist/index.html, found ${matches.length}`)
  }
  return html.replace(pattern, replacement)
}

function pageTitleFromApp(route) {
  const app = readFileSync(resolve(__dirname, 'src/App.jsx'), 'utf8')
  const block = app.match(/const PAGE_TITLES\s*=\s*\{([^}]*)\}/)
  const entry = block && block[1].match(new RegExp(`${escapeRegExp(route)}\\s*:\\s*"([^"]+)"`))
  if (!entry) throw new Error(`routed-pages: no PAGE_TITLES entry for "${route}" in src/App.jsx`)
  return entry[1]
}

function parseSource(file) {
  let src = readFileSync(resolve(__dirname, file), 'utf8')
  src = src.replace(/<!--[\s\S]*?-->/g, '')
  const desc = src.match(/<meta\s+name="description"\s+content="([^"]*)"\s*>/)
  if (!desc) throw new Error(`routed-pages: ${file} needs a <meta name="description"> tag`)
  src = src.replace(desc[0], '')
  const jsonLd = []
  src = src.replace(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g, (tag, body) => {
    JSON.parse(body) // fail the build on malformed structured data
    jsonLd.push(tag.trim())
    return ''
  })
  return { description: desc[1], jsonLd, body: src.trim() }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" }
const decodeEntities = (s) => s.replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? m)

// Every sentence of the static copy (over 25 characters) must be present in
// the compiled React bundle, otherwise the static page has drifted from the
// view that replaces it. Text is split at tag boundaries first because that is
// how JSX splits it into string literals.
function sentencesOf(bodyHtml) {
  const text = bodyHtml.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
  const out = []
  for (const node of text.split(/<[^>]+>/)) {
    const clean = decodeEntities(node).replace(/\s+/g, ' ').trim()
    if (!clean) continue
    for (const sentence of clean.split(/(?<=[.?!])\s+/)) {
      const s = sentence.trim()
      if (s.length > 25) out.push(s)
    }
  }
  return out
}

function bundleText(dist) {
  const dir = resolve(dist, 'assets')
  return readdirSync(dir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(resolve(dir, f), 'utf8'))
    .join('\n')
    .replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\(["'])/g, '$1')
}

function checkDrift(route, body, bundle) {
  const missing = sentencesOf(body).filter((s) => !bundle.includes(s))
  if (missing.length) {
    throw new Error(
      `routed-pages: static copy for /${route}/ has drifted from the React view. ` +
      `These sentences are not in the built bundle:\n  - ${missing.join('\n  - ')}`,
    )
  }
}

function buildRoutedPage(homepage, { route, source }, bundle) {
  const url = `${SITE}/${route}/`
  const title = pageTitleFromApp(route)
  const { description, jsonLd, body } = parseSource(source)
  checkDrift(route, body, bundle)

  let html = homepage
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>')
  html = replaceOnce(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttr(description)}">`, 'meta description')
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'canonical link')
  html = replaceOnce(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url')
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttr(title)}">`, 'og:title')
  html = replaceOnce(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttr(description)}">`, 'og:description')
  html = replaceOnce(html, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeAttr(title)}">`, 'twitter:title')
  html = replaceOnce(html, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeAttr(description)}">`, 'twitter:description')

  // Keep only site-wide structured data, then add the page's own nodes.
  let kept = 0
  html = html.replace(/[ \t]*<script type="application\/ld\+json">([\s\S]*?)<\/script>\n?/g, (tag, json) => {
    const type = JSON.parse(json)['@type']
    if (SITEWIDE_JSONLD_TYPES.has(type)) { kept++; return tag }
    return ''
  })
  if (kept === 0) throw new Error('routed-pages: no site-wide JSON-LD (Organization/WebSite) found to keep')
  html = html.replace(/[ \t]*<!--\s*Schema\.org JSON-LD:[^\n]*-->\n(?![ \t]*<script type="application\/ld\+json">)/g, '')
  html = replaceOnce(html, /<\/head>/, `${jsonLd.map((t) => `    ${t}`).join('\n')}\n</head>`, '</head>')

  // The homepage <noscript> fallback describes the homepage; the static copy
  // in #root plays that role here.
  html = html.replace(/[ \t]*<noscript>[\s\S]*?<\/noscript>\n?/, '')
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">\n${body}\n</div>`, 'empty #root container')
  return html
}

function routedPages() {
  return {
    name: 'routed-pages',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      const homepage = readFileSync(resolve(dist, 'index.html'), 'utf8')
      const bundle = bundleText(dist)
      for (const page of ROUTED_PAGES) {
        mkdirSync(resolve(dist, page.route), { recursive: true })
        writeFileSync(resolve(dist, page.route, 'index.html'), buildRoutedPage(homepage, page, bundle))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), routedPages()],
  base: '/',
})

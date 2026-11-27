// Lists every indexable HTML page with its <title> and meta description lengths.
// Usage: node seo/audit-lengths.mjs [--json]
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const pages = ['index.html']
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.html')) pages.push(relative(ROOT, p))
  }
}
walk(join(ROOT, 'public'))

const attr = (html, re) => (html.match(re) || [])[1] || ''
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
const rows = []
for (const page of pages.sort()) {
  const html = readFileSync(join(ROOT, page), 'utf8')
  const robots = attr(html, /<meta\s+name="robots"\s+content="([^"]*)"/i)
  if (/noindex/i.test(robots)) continue
  if (page === 'public/404.html') continue
  const title = decode(attr(html, /<title>([^<]*)<\/title>/i).trim())
  const desc = decode(attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i).trim())
  rows.push({ page: page.replace(/^public\//, '').replace(/\/index\.html$/, '/').replace(/^index\.html$/, '/'), title, titleLen: title.length, desc, descLen: desc.length })
}
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2))
} else {
  const pad = (s, n) => String(s).padEnd(n)
  console.log(pad('page', 58) + pad('title', 6) + 'desc')
  for (const r of rows) console.log(pad(r.page, 58) + pad(r.titleLen, 6) + r.descLen)
  const over = rows.filter((r) => r.titleLen > 60).length, overD = rows.filter((r) => r.descLen > 160 || r.descLen < 120).length
  console.log(`\n${rows.length} pages; titles over 60: ${over}; descriptions outside 120-160: ${overD}`)
  const dupT = rows.map((r) => r.title).filter((t, i, a) => a.indexOf(t) !== i)
  const dupD = rows.map((r) => r.desc).filter((t, i, a) => a.indexOf(t) !== i)
  if (dupT.length) console.log('duplicate titles:', [...new Set(dupT)])
  if (dupD.length) console.log('duplicate descriptions:', [...new Set(dupD)].map((d) => d.slice(0, 60)))
}

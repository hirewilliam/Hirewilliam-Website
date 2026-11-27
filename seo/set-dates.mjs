// Sets honest modification dates after a site-wide change.
//
//   node seo/set-dates.mjs YYYY-MM-DD [page ...]
//
// For each page given as a repo-relative HTML path (default: every indexable
// page plus index.html), rewrites every JSON-LD "dateModified" in that file to
// the date (keeping a T12:00:00Z time where the old value had a time) and sets
// the matching <lastmod> in public/sitemap.xml. Pages not given are left alone.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const [date, ...given] = process.argv.slice(2)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) { console.error('usage: node seo/set-dates.mjs YYYY-MM-DD [page ...]'); process.exit(2) }

let pages = given
if (pages.length === 0) {
  pages = ['index.html']
  const walk = (dir) => { for (const n of readdirSync(dir)) { const p = join(dir, n); if (statSync(p).isDirectory()) walk(p); else if (n.endsWith('.html')) pages.push(relative(ROOT, p)) } }
  walk(join(ROOT, 'public'))
  pages = pages.filter((p) => p !== 'public/404.html' && !/noindex/i.test(readFileSync(join(ROOT, p), 'utf8').match(/<meta\s+name="robots"\s+content="([^"]*)"/i)?.[1] || ''))
}

const urlFor = (p) => 'https://hirewilliam.com/' + (p === 'index.html' ? '' : p.replace(/^public\//, '').replace(/index\.html$/, ''))
let sitemap = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8')
let touchedJson = 0, touchedSitemap = 0
for (const p of pages) {
  const file = join(ROOT, p)
  if (!existsSync(file)) { console.error(`missing: ${p}`); process.exit(1) }
  let html = readFileSync(file, 'utf8')
  const next = html.replace(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})(T[^"]*)?"/g, (m, d, t) => { touchedJson++; return `"dateModified": "${date}${t ? 'T12:00:00Z' : ''}"` })
  if (next !== html) writeFileSync(file, next)
  const url = urlFor(p)
  const re = new RegExp(`(<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*(</lastmod>)`)
  if (re.test(sitemap)) { sitemap = sitemap.replace(re, (m, a, z) => a + date + z); touchedSitemap++ }
  else console.warn(`not in sitemap: ${url}`)
}
writeFileSync(join(ROOT, 'public/sitemap.xml'), sitemap)
console.log(`${pages.length} pages: ${touchedJson} dateModified values and ${touchedSitemap} sitemap lastmod entries set to ${date}`)

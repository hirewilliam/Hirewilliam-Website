// Applies seo/page-meta.json to the site's HTML pages.
//
//   node seo/apply-page-meta.mjs --titles        rewrite <title>, og:title, twitter:title
//   node seo/apply-page-meta.mjs --descriptions  rewrite meta description, og:description, twitter:description
//   node seo/apply-page-meta.mjs --check         report only, change nothing
//
// Prints one row per page: page, old length, new length. Fails if a title is
// over 60 characters, a description is outside 120 to 160, or values repeat.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const meta = JSON.parse(readFileSync(join(ROOT, 'seo/page-meta.json'), 'utf8'))
delete meta._note
const args = new Set(process.argv.slice(2))
const doTitles = args.has('--titles'), doDescs = args.has('--descriptions'), check = args.has('--check')
if (!doTitles && !doDescs && !check) {
  console.error('usage: node seo/apply-page-meta.mjs --titles | --descriptions | --check')
  process.exit(2)
}

const fileFor = (page) => page === '/' ? 'index.html' : page.endsWith('.html') ? `public/${page}` : `public/${page}index.html`
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

// Replace the content attribute of one meta tag, matched by name= or property=.
function setMeta(html, attrName, attrValue, content, page) {
  const re = new RegExp(`(<meta\\s+${attrName}="${attrValue}"\\s+content=")([^"]*)(")`, 'i')
  if (!re.test(html)) {
    const re2 = new RegExp(`(<meta\\s+content=")([^"]*)("\\s+${attrName}="${attrValue}")`, 'i')
    if (!re2.test(html)) { console.warn(`  ${page}: no <meta ${attrName}="${attrValue}">, skipped`); return html }
    return html.replace(re2, (m, a, old, z) => a + escapeAttr(content) + z)
  }
  // Function replacement: a literal "$1,500" in the content must not be read as a group reference.
  return html.replace(re, (m, a, old, z) => a + escapeAttr(content) + z)
}

const rows = []
let failed = false
const seenTitles = new Map(), seenDescs = new Map()
for (const [page, { title, description }] of Object.entries(meta)) {
  const file = join(ROOT, fileFor(page))
  if (!existsSync(file)) { console.error(`missing file for ${page}: ${fileFor(page)}`); failed = true; continue }
  let html = readFileSync(file, 'utf8')
  const oldTitle = decode((html.match(/<title>([^<]*)<\/title>/i) || ['', ''])[1].trim())
  const oldDesc = decode((html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || ['', ''])[1].trim())

  if (title.length > 60) { console.error(`title over 60 (${title.length}): ${page}`); failed = true }
  if (description.length < 120 || description.length > 160) { console.error(`description outside 120-160 (${description.length}): ${page}`); failed = true }
  if (seenTitles.has(title)) { console.error(`duplicate title: ${page} and ${seenTitles.get(title)}`); failed = true }
  if (seenDescs.has(description)) { console.error(`duplicate description: ${page} and ${seenDescs.get(description)}`); failed = true }
  seenTitles.set(title, page); seenDescs.set(description, page)

  if (doTitles) {
    html = html.replace(/<title>[^<]*<\/title>/i, () => `<title>${escapeText(title)}</title>`)
    html = setMeta(html, 'property', 'og:title', title, page)
    html = setMeta(html, 'name', 'twitter:title', title, page)
  }
  if (doDescs) {
    if (/<meta\s+name="description"/i.test(html)) html = setMeta(html, 'name', 'description', description, page)
    else console.warn(`  ${page}: no meta description tag to replace (add it by hand)`)
    html = setMeta(html, 'property', 'og:description', description, page)
    html = setMeta(html, 'name', 'twitter:description', description, page)
  }
  if (!check && (doTitles || doDescs)) writeFileSync(file, html)
  rows.push({ page, oldTitle: oldTitle.length, newTitle: title.length, oldDesc: oldDesc.length, newDesc: description.length })
}

const pad = (s, n) => String(s).padEnd(n)
console.log(pad('page', 52) + pad('title old', 11) + pad('new', 6) + pad('desc old', 10) + 'new')
for (const r of rows) console.log(pad(r.page, 52) + pad(r.oldTitle, 11) + pad(r.newTitle, 6) + pad(r.oldDesc, 10) + r.newDesc)
console.log(`\n${rows.length} pages${failed ? '; FAILED checks above' : '; all checks passed'}`)
if (failed) process.exit(1)

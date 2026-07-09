// Extracts the public API (props / events / slots) of each catalog component
// from primevue's generated index.d.ts JSDoc, and writes one JSON file per
// component into components/catalog/api/ (lazy-imported by the catalog page).
// Re-run after upgrading primevue:
//   node scripts/generate-catalog-api.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Aura from '@primeuix/themes/aura'
import { categories } from '../components/catalog/registry.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'components', 'catalog', 'api')
mkdirSync(outDir, { recursive: true })

// Components whose main props live in a differently named interface
const interfaceOverrides = { Tooltip: 'TooltipOptions' }

const stripStars = block => block
  .split('\n')
  .map(l => l.replace(/^\s*\/?\*+\/?\s?/, '').trimEnd())
  .join('\n')
  .trim()

const jsdocText = block => stripStars(block)
  .split('\n')
  .filter(l => !l.startsWith('@') && !l.startsWith('[Live Demo]'))
  .join(' ')
  .replace(/\s+/g, ' ')
  .trim()

const jsdocTag = (block, tag) => {
  const m = stripStars(block).match(new RegExp(`@${tag}\\s+(.+)`))
  return m ? m[1].trim() : undefined
}

// Returns the body between the braces of `export interface <name> ... { ... }`
function extractInterface(src, name) {
  const m = src.match(new RegExp(`export (?:declare )?interface ${name}(?:<[^>]*>)?(\\s+extends\\s+[^{]+?)?\\s*\\{`))
  if (!m) return null
  let i = m.index + m[0].length
  let depth = 1
  const start = i
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') depth--
    i++
  }
  return { body: src.slice(start, i - 1), extends: m[1]?.replace(/\s+extends\s+/, '').trim() }
}

// Parses `/** doc */ member...;` pairs from an interface body, ignoring
// members nested inside object types (e.g. documented slot-scope fields)
function parseMembers(body) {
  const members = []
  let i = 0
  while (i < body.length) {
    // advance to the next top-level JSDoc block
    if (!body.startsWith('/**', i)) { i++; continue }
    const docEnd = body.indexOf('*/', i + 3)
    if (docEnd === -1) break
    const doc = body.slice(i, docEnd + 2)
    i = docEnd + 2
    // capture the following member up to its top-level semicolon,
    // consuming any nested braces (and the JSDoc blocks inside them)
    let depth = 0
    let sig = ''
    while (i < body.length) {
      const ch = body[i]
      if ('{(['.includes(ch)) depth++
      else if ('})]'.includes(ch)) depth--
      else if (ch === ';' && depth <= 0) { i++; break }
      sig += ch
      i++
    }
    sig = sig.trim()
    if (!sig || sig.startsWith('/*')) continue
    const nameMatch = sig.match(/^(?:readonly\s+)?(?:'([^']+)'|"([^"]+)"|([\w$]+))\s*(\?)?\s*([:(])/)
    if (!nameMatch) continue
    const name = nameMatch[1] || nameMatch[2] || nameMatch[3]
    const optional = !!nameMatch[4]
    const isMethod = nameMatch[5] === '('
    let type = ''
    if (!isMethod) {
      type = sig.slice(sig.indexOf(':') + 1).trim().replace(/\s*\|\s*undefined$/, '').replace(/\s+/g, ' ')
    } else {
      type = sig.slice(name.length + (nameMatch[1] || nameMatch[2] ? 2 : 0)).trim().replace(/\s+/g, ' ')
    }
    members.push({
      name,
      optional,
      type,
      description: jsdocText(doc),
      default: jsdocTag(doc, 'defaultValue'),
      deprecated: /@deprecated/.test(doc) || undefined,
    })
  }
  return members
}

// ---- design tokens (CSS variables) from the Aura preset ----
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function flattenTokens(obj, path = []) {
  const out = []
  for (const [k, v] of Object.entries(obj || {})) {
    if (k === 'colorScheme') continue
    if (v && typeof v === 'object') out.push(...flattenTokens(v, [...path, k]))
    else out.push({ path: [...path, k], value: String(v) })
  }
  return out
}

// Maps token paths to CSS variable names the way @primeuix/styled does:
// `--p-<component>-<path>` with the leading `root` segment dropped
function componentTokens(name) {
  const comp = Aura.components?.[name.toLowerCase()]
  if (!comp) return []
  const map = new Map()
  const add = (entries, key) => {
    for (const t of entries) {
      const segs = t.path[0] === 'root' ? t.path.slice(1) : t.path
      const cssVar = `--p-${name.toLowerCase()}-${segs.map(kebab).join('-')}`
      const cur = map.get(cssVar) || { name: cssVar }
      cur[key] = t.value
      map.set(cssVar, cur)
    }
  }
  add(flattenTokens(comp), 'value')
  add(flattenTokens(comp.colorScheme?.light), 'value')
  add(flattenTokens(comp.colorScheme?.dark), 'dark')
  return [...map.values()]
}

function moduleDescription(src) {
  const m = src.match(/^\/\*\*([\s\S]*?)\*\//)
  return m ? jsdocText(m[0]) : ''
}

let missing = []
for (const cat of categories) {
  for (const name of cat.items) {
    const dir = name.toLowerCase()
    let src
    try {
      src = readFileSync(join(root, 'node_modules', 'primevue', dir, 'index.d.ts'), 'utf8')
    } catch {
      missing.push(`${name}: no index.d.ts`)
      continue
    }
    const propsName = interfaceOverrides[name] || `${name}Props`
    const props = extractInterface(src, propsName)
    const slots = extractInterface(src, `${name}Slots`)
    const emits = extractInterface(src, `${name}EmitsOptions`) || extractInterface(src, `${name}Emits`)

    const api = {
      name,
      category: cat.label,
      description: moduleDescription(src),
      docUrl: `https://primevue.org/${dir}/`,
      extends: props?.extends,
      props: props ? parseMembers(props.body).filter(p => !['pt', 'ptOptions', 'dt'].includes(p.name)) : [],
      events: emits ? parseMembers(emits.body) : [],
      slots: slots ? parseMembers(slots.body) : [],
      tokens: componentTokens(name),
    }
    if (!props) missing.push(`${name}: no ${propsName} interface`)
    writeFileSync(join(outDir, `${dir}.json`), JSON.stringify(api, null, 1))
  }
}

console.log(`wrote ${categories.reduce((n, c) => n + c.items.length, 0) - missing.length} component APIs to components/catalog/api/`)
if (missing.length) console.log('issues:\n  ' + missing.join('\n  '))

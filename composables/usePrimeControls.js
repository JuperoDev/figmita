// Shared logic for auto-generating prop controls from the extracted PrimeVue
// API JSON (components/catalog/api/*.json). Used by the catalog playground
// and the canvas Props editor.

// Props that can't visibly change a component — documented in API tables,
// but noise as live controls
export const invisibleProps = new Set(['tabindex', 'name', 'id', 'autocomplete', 'defaultValue',
  'formControl', 'inputId', 'inputClass', 'inputStyle', 'panelClass', 'panelStyle',
  'overlayClass', 'overlayStyle', 'maskClass', 'ariaLabel', 'ariaLabelledby'])

// Splits a union type on top-level `|` only (not inside parens/generics)
export function splitUnion(t) {
  const parts = []
  let depth = 0
  let cur = ''
  for (let i = 0; i < t.length; i++) {
    const ch = t[i]
    if ('({[<'.includes(ch)) depth++
    else if (')}]'.includes(ch)) depth--
    else if (ch === '>' && t[i - 1] !== '=') depth--
    if (ch === '|' && depth === 0) { parts.push(cur.trim()); cur = '' }
    else cur += ch
  }
  parts.push(cur.trim())
  return parts.filter(Boolean)
}

// Maps an extracted TypeScript prop type to an editable control, if possible
export function controlFor(p) {
  let t = p.type.trim()
  const hinted = t.match(/^HintedString<(.+)>$/)
  if (hinted) t = hinted[1]
  const parts = splitUnion(t)
  if (parts.length > 1 && parts.every(s => /^'[^']*'$/.test(s))) {
    return { kind: 'select', options: parts.map(s => s.slice(1, -1)), editable: !!hinted }
  }
  if (parts.length === 1 && parts[0] === 'boolean') return { kind: 'bool' }
  if (parts.length === 1 && parts[0] === 'number') return { kind: 'number' }
  if (parts.includes('string')) return { kind: 'text' }
  return null
}

// Filters a component API's props down to the ones a live control can edit
export function editableProps(api) {
  return (api?.props || [])
    .filter(p => !p.deprecated && p.name !== 'modelValue'
      && !invisibleProps.has(p.name) && !p.name.startsWith('aria'))
    .map(p => ({ ...p, control: controlFor(p) }))
    .filter(p => p.control)
}

const apiLoaders = import.meta.glob('~/components/catalog/api/*.json', { import: 'default' })

export async function loadComponentApi(name) {
  const key = Object.keys(apiLoaders).find(k => k.endsWith(`/${String(name).toLowerCase()}.json`))
  return key ? await apiLoaders[key]() : null
}

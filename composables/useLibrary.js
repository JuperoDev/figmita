import { ref, watch } from 'vue'
import { uid } from './useFactories.js'

// User-defined component library: pasted template + optional setup logic +
// CSS/SCSS. Persisted to localStorage, separate from the prototype autosave.
const STORAGE_KEY = 'figmita-library-v1'

const libComponents = ref([])
let loaded = false

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) libComponents.value = JSON.parse(raw)
  } catch {}
  watch(libComponents, (v) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch {}
  }, { deep: true })
}

export function useLibrary() {
  load()

  function saveComponent({ id, name, template, setup, style, styleLang, scoped, compiledCss }) {
    const entry = {
      id: id || `lib-${uid()}`,
      name: name.trim() || 'Untitled',
      template,
      setup: setup || '',
      style: style || '',
      styleLang: styleLang || 'css',
      scoped: !!scoped,
      compiledCss: compiledCss ?? style ?? '',
    }
    const i = libComponents.value.findIndex(c => c.id === entry.id)
    if (i >= 0) libComponents.value[i] = entry
    else libComponents.value.push(entry)
    return entry
  }

  function deleteComponent(id) {
    libComponents.value = libComponents.value.filter(c => c.id !== id)
  }

  function getComponent(id) {
    return libComponents.value.find(c => c.id === id) ?? null
  }

  return { libComponents, saveComponent, deleteComponent, getComponent }
}

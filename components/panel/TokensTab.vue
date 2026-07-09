<script setup>
import { ref, computed, watch } from 'vue'

const { activeElement } = useElements()

const compName = computed(() => activeElement.value?.config?.component)

const api = ref(null)
watch(compName, async (n) => {
  api.value = n ? await loadComponentApi(n) : null
}, { immediate: true })

const tokens = computed(() => api.value?.tokens || [])

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? tokens.value.filter(t => t.name.includes(q)) : tokens.value
})

const edits = computed(() => activeElement.value?.config?.tokens || {})
const touched = computed(() => Object.keys(edits.value).length > 0)

// Current resolved values from the live theme (the component is mounted on
// the canvas, so its token declarations exist at :root)
const current = ref({})
function readCurrent() {
  if (typeof window === 'undefined' || !tokens.value.length) return
  const cs = getComputedStyle(document.documentElement)
  const cur = {}
  for (const t of tokens.value) cur[t.name] = cs.getPropertyValue(t.name).trim()
  current.value = cur
}
watch(tokens, () => setTimeout(readCurrent, 100), { immediate: true })

function setToken(name, v) {
  const el = activeElement.value
  if (!el) return
  if (!el.config.tokens) el.config.tokens = {}
  if (v === '' || v == null) delete el.config.tokens[name]
  else el.config.tokens[name] = v
}
function resetTokens() {
  if (activeElement.value) activeElement.value.config.tokens = {}
}

const short = n => n.replace(`--p-${(compName.value || '').toLowerCase()}-`, '')
</script>

<template>
  <div v-if="activeElement" class="tokens-editor">
    <p class="prop-section" style="margin-top:12px;">
      CSS variables
      <button v-if="touched" class="reset-link" @click="resetTokens">reset</button>
    </p>

    <template v-if="tokens.length">
      <div class="ce-field">
        <input v-model="query" class="ce-input" :placeholder="`Filter ${tokens.length} tokens…`" />
      </div>

      <div v-for="t in filtered" :key="t.name" class="ce-field" :title="`${t.name}\ntheme: ${t.value}`">
        <label class="ce-label">{{ short(t.name) }}</label>
        <div class="token-row">
          <input
            v-if="looksLikeColorToken(t.name) || isColorish(edits[t.name] ?? current[t.name])"
            type="color" class="token-color"
            :value="cssToHex(edits[t.name] ?? current[t.name])"
            @input="e => setToken(t.name, e.target.value)"
          >
          <input
            class="ce-input"
            :value="edits[t.name] ?? ''"
            :placeholder="current[t.name] || t.value"
            @input="e => setToken(t.name, e.target.value)"
          >
        </div>
      </div>
      <p v-if="!filtered.length" class="hint-text" style="padding:0 12px;">No matches</p>
    </template>

    <p v-else class="hint-text" style="padding:4px 12px;">
      {{ compName }} has no design tokens of its own in the theme.
    </p>
  </div>
</template>

<style scoped>
.prop-section { display:flex; align-items:center; justify-content:space-between; font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.reset-link { background:none; border:none; color:#a78bfa; font-size:10px; cursor:pointer; font-family:inherit; text-transform:none; letter-spacing:0; padding:0; }
.reset-link:hover { text-decoration:underline; }
.ce-field { padding:0 12px 8px; }
.ce-label { display:block; font-size:10px; color:#888; margin-bottom:4px; font-family:'JetBrains Mono',monospace; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:11px; padding:5px 8px; outline:none; font-family:'JetBrains Mono',monospace; user-select:text; min-width:0; }
.ce-input:focus { border-color:#7c5cfc; }
.token-row { display:flex; align-items:center; gap:6px; }
.token-color { width:24px; height:24px; flex-shrink:0; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.token-color::-webkit-color-swatch-wrapper { padding:2px; }
.token-color::-webkit-color-swatch { border:none; border-radius:3px; }
.hint-text { font-size:11px; color:#555; margin:4px 0 0; }
</style>

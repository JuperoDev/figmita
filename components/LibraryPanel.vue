<script setup>
import { ref, reactive } from 'vue'

const { libComponents, saveComponent, deleteComponent } = useLibrary()
const { addElement } = useElements()

const showEditor = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const draft = reactive({
  id: null, name: '', template: '', setup: '', style: '', styleLang: 'css', scoped: true,
})

// ---- SFC paste support: split a pasted .vue file into the three panes ----

// Pasted <script setup> bodies declare bindings without returning them; the
// runtime setup() needs a return, so strip imports and synthesize one
function adaptSetupScript(src) {
  let out = src
    .replace(/^\s*import\s[^;\n]*?from\s+['"]vue['"];?\s*$/gm, '')
    .replace(/^\s*(import\s[^;\n]*?;?)\s*$/gm, (m, imp) => `// ${imp} — imports aren't supported here`)
    .trim()
  if (!/^\s*return\s*\{/m.test(out)) {
    const names = [...out.matchAll(/^\s*(?:const|let|var|function)\s+\{?\s*([\w$]+(?:\s*,\s*[\w$]+)*)/gm)]
      .flatMap(m => m[1].split(',').map(s => s.trim()))
      .filter(n => /^[\w$]+$/.test(n))
    const uniq = [...new Set(names)]
    if (uniq.length) out += `\n\nreturn { ${uniq.join(', ')} }`
  }
  return out
}

function parseStyleAttrs(attrs) {
  const lang = attrs.match(/lang\s*=\s*["']?(scss|sass)["']?/i)?.[1]?.toLowerCase()
  return { lang: lang || 'css', scoped: /\bscoped\b/i.test(attrs) }
}

// Returns true when the text was a full SFC and got distributed
function applySfc(text) {
  const hasScript = /<script[^>]*>/i.test(text)
  const hasStyle = /<style[^>]*>/i.test(text)
  const tpl = text.match(/<template[^>]*>([\s\S]*)<\/template>/i)
  if (!tpl || (!hasScript && !hasStyle && !/^\s*<template[\s>](?![#v])/.test(text))) return false
  draft.template = tpl[1].trim()
  const script = text.match(/<script[^>]*>([\s\S]*?)<\/script>/i)
  if (script) draft.setup = adaptSetupScript(script[1])
  const style = text.match(/<style([^>]*)>([\s\S]*?)<\/style>/i)
  if (style) {
    const { lang, scoped } = parseStyleAttrs(style[1])
    draft.style = style[2].trim()
    draft.styleLang = lang
    draft.scoped = scoped
  }
  return true
}

function onTemplatePaste(e) {
  const text = e.clipboardData?.getData('text') ?? ''
  if (applySfc(text)) e.preventDefault()
}

// Pasting `<style scoped lang="scss">…</style>` straight into the style pane
function onStylePaste(e) {
  const text = e.clipboardData?.getData('text') ?? ''
  const m = text.match(/^\s*<style([^>]*)>([\s\S]*?)<\/style>\s*$/i)
  if (!m) return
  e.preventDefault()
  const { lang, scoped } = parseStyleAttrs(m[1])
  draft.style = m[2].trim()
  draft.styleLang = lang
  draft.scoped = scoped
}

function newComponent() {
  Object.assign(draft, {
    id: null,
    name: '',
    template: '<div class="my-comp">\n  <h3>{{ title }}</h3>\n  <p>Count: {{ count }}</p>\n  <button class="my-btn" @click="count++">+1</button>\n</div>',
    setup: "const count = ref(0)\nreturn { title: 'My component', count }",
    style: '.my-comp {\n  padding: 16px 20px;\n  border-radius: 10px;\n  background: #eef2ff;\n  .my-btn {\n    padding: 6px 14px;\n    border: none;\n    border-radius: 6px;\n    background: #6366f1;\n    color: #fff;\n    cursor: pointer;\n  }\n}',
    styleLang: 'scss',
    scoped: true,
  })
  errorMsg.value = ''
  showEditor.value = true
}

function editComponent(c) {
  Object.assign(draft, { id: c.id, name: c.name, template: c.template, setup: c.setup, style: c.style, styleLang: c.styleLang, scoped: !!c.scoped })
  errorMsg.value = ''
  showEditor.value = true
}

const compile = (source, syntax) =>
  $fetch('/api/compile-scss', { method: 'POST', body: { source, syntax } }).then(r => r.css)

async function save() {
  errorMsg.value = ''
  if (!draft.template.trim()) { errorMsg.value = 'Template is required'; return }
  saving.value = true
  try {
    // scoped styles compile wrapped in the instance class CustomMock renders
    if (!draft.id) draft.id = `lib-${uid()}`
    let compiledCss = draft.style
    if (draft.style.trim()) {
      // indented sass can't nest inside a wrapper, so flatten it to css first
      let src = draft.styleLang === 'sass' ? await compile(draft.style, 'indented') : draft.style
      if (draft.scoped) src = `.cc-${draft.id} {\n${src}\n}`
      compiledCss = (draft.scoped || draft.styleLang === 'scss') ? await compile(src, 'scss') : src
    }
    saveComponent({ ...draft, compiledCss })
    showEditor.value = false
  } catch (err) {
    errorMsg.value = err.data?.error || err.message || 'Style compile failed'
  } finally {
    saving.value = false
  }
}

function place(c) {
  addElement('custom', { libId: c.id })
}
</script>

<template>
  <div class="library-panel">
    <p class="lib-hint">
      Your components: paste a whole .vue file (or template, logic, and styles
      separately — CSS, SCSS, or Sass, scoped supported). PrimeFlex utilities
      and PrimeVue components work inside templates.
    </p>

    <div v-for="c in libComponents" :key="c.id" class="lib-item">
      <i class="pi pi-sparkles lib-ico" />
      <span class="lib-name" :title="c.name">{{ c.name }}</span>
      <button class="lib-act" title="Add to active screen" @click="place(c)"><i class="pi pi-plus" /></button>
      <button class="lib-act" title="Edit" @click="editComponent(c)"><i class="pi pi-pencil" /></button>
      <button class="lib-act danger" title="Delete" @click="deleteComponent(c.id)"><i class="pi pi-times" /></button>
    </div>
    <p v-if="!libComponents.length" class="lib-empty">No components yet</p>

    <button class="lib-new" @click="newComponent">
      <i class="pi pi-plus" /> New component
    </button>

    <Dialog v-model:visible="showEditor" :header="draft.id ? 'Edit component' : 'New component'" modal :style="{ width: '560px' }">
      <div class="ed-field">
        <label class="ed-label">Name</label>
        <input class="ed-input" v-model="draft.name" placeholder="PriceTag" />
      </div>
      <div class="ed-field">
        <label class="ed-label">Template (Vue) — paste a whole .vue file here and it splits itself</label>
        <textarea class="ed-code" rows="7" v-model="draft.template" spellcheck="false" @paste="onTemplatePaste" />
      </div>
      <div class="ed-field">
        <label class="ed-label">Logic — runs as setup(); `ref`, `computed`, `reactive` available; return the bindings</label>
        <textarea class="ed-code" rows="4" v-model="draft.setup" spellcheck="false" />
      </div>
      <div class="ed-field">
        <label class="ed-label">
          Style — pasting a &lt;style&gt; tag sets lang &amp; scoped automatically
          <span class="ed-style-opts">
            <label class="ed-scoped" title="Only affects this component (like <style scoped>)">
              <input type="checkbox" v-model="draft.scoped" /> scoped
            </label>
            <select v-model="draft.styleLang" class="ed-lang">
              <option value="css">CSS</option>
              <option value="scss">SCSS</option>
              <option value="sass">Sass (indented)</option>
            </select>
          </span>
        </label>
        <textarea class="ed-code" rows="6" v-model="draft.style" spellcheck="false" @paste="onStylePaste" />
      </div>
      <p v-if="errorMsg" class="ed-error">{{ errorMsg }}</p>
      <template #footer>
        <button class="dlg-btn secondary" @click="showEditor = false">Cancel</button>
        <button class="dlg-btn primary" :disabled="saving" @click="save">
          {{ saving ? 'Compiling…' : 'Save' }}
        </button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.library-panel { padding: 8px 0; }
.lib-hint { font-size:11px; color:#666; line-height:1.6; padding:4px 12px 10px; margin:0; }
.lib-item { display:flex; align-items:center; gap:7px; padding:6px 12px; color:#ccc; }
.lib-item:hover { background:#2e2e2e; }
.lib-ico { font-size:12px; color:#a78bfa; flex-shrink:0; }
.lib-name { flex:1; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lib-act { display:flex; align-items:center; justify-content:center; width:22px; height:22px; background:transparent; border:none; border-radius:4px; color:#777; cursor:pointer; font-size:11px; transition:all .12s; flex-shrink:0; }
.lib-act:hover { background:#3a3a3a; color:#eee; }
.lib-act.danger:hover { color:#f87171; }
.lib-empty { font-size:11px; color:#555; padding:4px 12px; margin:0; }
.lib-new { display:flex; align-items:center; gap:6px; width:calc(100% - 24px); margin:10px 12px 0; padding:7px 10px; background:#1e1e1e; border:1px dashed #3a3a3a; border-radius:6px; color:#666; font-size:12px; cursor:pointer; font-family:inherit; transition:all .15s; justify-content:center; }
.lib-new:hover { border-color:#7c5cfc; color:#a78bfa; background:#1a1a2e; }
.ed-field { margin-bottom:12px; }
.ed-label { display:flex; align-items:center; justify-content:space-between; font-size:11px; color:#888; margin-bottom:5px; }
.ed-input { width:100%; box-sizing:border-box; background:var(--p-surface-100,#f4f4f5); border:1px solid var(--p-content-border-color,#ddd); border-radius:6px; font-size:13px; padding:7px 10px; outline:none; font-family:inherit; }
.ed-code { width:100%; box-sizing:border-box; resize:vertical; background:#16181d; color:#e2e8f0; border:1px solid #333; border-radius:6px; font-size:12px; padding:8px 10px; outline:none; font-family:'JetBrains Mono','Fira Code',monospace; line-height:1.5; user-select:text; }
.ed-lang { font-size:11px; border:1px solid var(--p-content-border-color,#ddd); border-radius:4px; padding:2px 4px; background:transparent; color:inherit; }
.ed-style-opts { display:inline-flex; align-items:center; gap:10px; }
.ed-scoped { display:inline-flex; align-items:center; gap:4px; font-size:11px; cursor:pointer; }
.ed-scoped input { margin:0; cursor:pointer; }
.ed-error { font-size:12px; color:#ef4444; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25); border-radius:6px; padding:8px 10px; margin:0; white-space:pre-wrap; }
.dlg-btn { padding:7px 14px; border-radius:6px; border:none; cursor:pointer; font-size:12px; font-family:inherit; transition:all .15s; }
.dlg-btn.secondary { background:#2a2a2a; color:#ccc; border:1px solid #3a3a3a; }
.dlg-btn.primary { background:#7c5cfc; color:white; margin-left:8px; }
.dlg-btn.primary:hover { background:#6d4fe0; }
.dlg-btn.primary:disabled { background:#3a3a3a; color:#666; cursor:not-allowed; }
</style>

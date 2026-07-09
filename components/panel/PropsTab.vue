<script setup>
import { ref, computed, watch } from 'vue'
import { playgrounds } from '~/components/catalog/playground'

const { activeElement } = useElements()

const compName = computed(() => activeElement.value?.config?.component)
const hasPlayground = computed(() => !!playgrounds[compName.value])

const api = ref(null)
watch(compName, async (n) => {
  api.value = n ? await loadComponentApi(n) : null
}, { immediate: true })

const controls = computed(() => (hasPlayground.value ? editableProps(api.value) : []))

const propsObj = computed(() => activeElement.value?.config?.props || {})
const touched = computed(() => Object.keys(propsObj.value).length > 0)

const cur = p => propsObj.value[p.name]
const boolCur = (p) => {
  const v = cur(p)
  return v !== undefined ? !!v : p.default === 'true'
}

function setProp(name, v) {
  const el = activeElement.value
  if (!el) return
  if (!el.config.props) el.config.props = {}
  if (v === '' || v === null || v === undefined) delete el.config.props[name]
  else el.config.props[name] = v
}

function resetProps() {
  if (activeElement.value) activeElement.value.config.props = {}
}
</script>

<template>
  <div v-if="activeElement" class="props-editor">
    <p class="prop-section" style="margin-top:12px;">
      {{ compName }} props
      <button v-if="touched" class="reset-link" @click="resetProps">reset</button>
    </p>

    <template v-if="hasPlayground">
      <div v-for="p in controls" :key="p.name" class="ce-field" :title="p.description">
        <template v-if="p.control.kind === 'bool'">
          <label class="bool-row">
            <input
              type="checkbox" :checked="boolCur(p)"
              @change="e => setProp(p.name, e.target.checked)"
            >
            <span class="ce-label bool-label">{{ p.name }}</span>
          </label>
        </template>

        <template v-else>
          <label class="ce-label">{{ p.name }}</label>
          <select
            v-if="p.control.kind === 'select'" class="dark-select"
            :value="cur(p) ?? ''" @change="e => setProp(p.name, e.target.value)"
          >
            <option value="">default{{ p.default ? ` (${p.default})` : '' }}</option>
            <option v-for="o in p.control.options" :key="o" :value="o">{{ o }}</option>
          </select>
          <input
            v-else-if="p.control.kind === 'number'" type="number" class="ce-input"
            :value="cur(p) ?? ''" :placeholder="p.default"
            @input="e => setProp(p.name, e.target.value === '' ? '' : Number(e.target.value))"
          >
          <div v-else class="text-row">
            <input
              v-if="/color/i.test(p.name)"
              type="color" class="token-color"
              :value="cssToHex(cur(p))"
              @input="e => setProp(p.name, e.target.value)"
            >
            <input
              class="ce-input"
              :value="cur(p) ?? ''" :placeholder="p.default || ''"
              @input="e => setProp(p.name, e.target.value)"
            >
          </div>
        </template>
      </div>
    </template>

    <p v-else class="preset-note">
      This element shows a preset example of <b>{{ compName }}</b> — it needs structured
      data to render, so its props aren't editable here.
    </p>

    <div class="prop-hr" />
    <div class="ce-field">
      <NuxtLink class="catalog-jump" :to="`/catalog/${(compName || '').toLowerCase()}`" target="_blank">
        <i class="pi pi-book" /> Open {{ compName }} in the catalog
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.prop-section { display:flex; align-items:center; justify-content:space-between; font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.reset-link { background:none; border:none; color:#a78bfa; font-size:10px; cursor:pointer; font-family:inherit; text-transform:none; letter-spacing:0; padding:0; }
.reset-link:hover { text-decoration:underline; }
.prop-hr { height:1px; background:#2e2e2e; margin:10px 0; }
.ce-field { padding:0 12px 8px; }
.ce-label { display:block; font-size:10px; color:#888; margin-bottom:4px; font-family:'JetBrains Mono',monospace; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 8px; outline:none; font-family:inherit; user-select:text; }
.ce-input:focus { border-color:#7c5cfc; }
.dark-select { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 6px; outline:none; font-family:inherit; cursor:pointer; }
.dark-select:focus { border-color:#7c5cfc; }
.bool-row { display:flex; align-items:center; gap:8px; cursor:pointer; padding:2px 0; }
.bool-row input { accent-color:#7c5cfc; cursor:pointer; margin:0; }
.bool-label { margin:0; }
.text-row { display:flex; align-items:center; gap:6px; }
.token-color { width:24px; height:24px; flex-shrink:0; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.token-color::-webkit-color-swatch-wrapper { padding:2px; }
.token-color::-webkit-color-swatch { border:none; border-radius:3px; }
.preset-note { font-size:11px; color:#888; line-height:1.6; padding:4px 12px 0; margin:0; }
.preset-note b { color:#bbb; }
.catalog-jump { display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px solid #333; border-radius:6px; background:#1e1e1e; color:#a78bfa; font-size:11px; text-decoration:none; transition:all .15s; }
.catalog-jump:hover { border-color:#7c5cfc; background:rgba(124,92,252,.08); }
</style>

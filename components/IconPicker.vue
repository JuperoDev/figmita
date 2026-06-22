<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PRIME_ICONS } from '~/composables/usePrimeIcons.js'

const props = defineProps({
  modelValue:  { type: String, default: '' },
  placeholder: { type: String, default: 'No icon' },
})
const emit = defineEmits(['update:modelValue'])

const open    = ref(false)
const search  = ref('')
const rootEl  = ref(null)

const currentBare = computed(() => {
  return (props.modelValue || '').split(' ').filter(Boolean).find(p => p.startsWith('pi-')) || ''
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return PRIME_ICONS
  return PRIME_ICONS.filter(name => name.includes(q))
})

function select(name) {
  emit('update:modelValue', name ? `pi ${name}` : '')
  open.value = false
  search.value = ''
}

function onClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="rootEl" class="icon-picker">
    <button type="button" class="icon-picker-trigger" @click="open = !open">
      <i v-if="currentBare" class="pi" :class="currentBare" />
      <i v-else class="pi pi-ban icon-picker-trigger-empty" />
      <span class="icon-picker-trigger-label">{{ currentBare || placeholder }}</span>
      <i class="pi pi-chevron-down icon-picker-caret" />
    </button>

    <div v-if="open" class="icon-picker-panel">
      <input v-model="search" class="icon-picker-search" placeholder="Search icons…" autofocus />
      <div class="icon-picker-grid">
        <button
          type="button"
          class="icon-picker-cell"
          :class="{ active: !currentBare }"
          title="No icon"
          @click="select('')"
        >
          <i class="pi pi-ban" />
        </button>
        <button
          v-for="name in filtered"
          :key="name"
          type="button"
          class="icon-picker-cell"
          :class="{ active: name === currentBare }"
          :title="name"
          @click="select(name)"
        >
          <i class="pi" :class="name" />
        </button>
      </div>
      <p v-if="filtered.length === 0" class="icon-picker-empty-msg">No icons match "{{ search }}"</p>
    </div>
  </div>
</template>

<style scoped>
.icon-picker { position:relative; }
.icon-picker-trigger {
  width:100%; display:flex; align-items:center; gap:8px; box-sizing:border-box;
  background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0;
  font-size:12px; padding:5px 8px; cursor:pointer; font-family:inherit;
}
.icon-picker-trigger:hover { border-color:#444; }
.icon-picker-trigger-empty { color:#555; }
.icon-picker-trigger-label { flex:1; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.icon-picker-caret { font-size:10px; color:#666; }

.icon-picker-panel {
  position:absolute; top:calc(100% + 4px); left:0; right:0; z-index:50;
  background:#1a1a1a; border:1px solid #333; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,.5);
  padding:8px; display:flex; flex-direction:column; gap:8px;
}
.icon-picker-search {
  width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px;
  color:#d0d0d0; font-size:12px; padding:6px 8px; outline:none; font-family:inherit;
}
.icon-picker-search:focus { border-color:#7c5cfc; }
.icon-picker-grid {
  display:grid; grid-template-columns:repeat(6, 1fr); gap:4px; max-height:220px; overflow-y:auto;
}
.icon-picker-cell {
  display:flex; align-items:center; justify-content:center; aspect-ratio:1; background:#1e1e1e;
  border:1px solid #2e2e2e; border-radius:4px; color:#999; cursor:pointer; font-size:14px;
}
.icon-picker-cell:hover { background:#2a2a2a; border-color:#7c5cfc; color:#a78bfa; }
.icon-picker-cell.active { background:rgba(124,92,252,.15); border-color:#7c5cfc; color:#a78bfa; }
.icon-picker-empty-msg { font-size:11px; color:#666; text-align:center; margin:4px 0 0; }
</style>

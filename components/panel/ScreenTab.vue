<script setup>
import { ref, computed } from 'vue'
import { categories } from '~/components/catalog/registry'

const { screens, activeScreen, startScreenId } = useScreens()
const { addElement } = useElements()

const primeQuery = ref('')
const filteredPrime = computed(() => {
  const q = primeQuery.value.trim().toLowerCase()
  if (!q) return categories
  return categories
    .map(c => ({ ...c, items: c.items.filter(i => i.toLowerCase().includes(q)) }))
    .filter(c => c.items.length)
})

const showMegaMenuDialog = ref(false)
const megaMenuItemsText  = ref('')

const megaMenuItemLines = computed(() =>
  megaMenuItemsText.value.split('\n').map(s => s.trim()).filter(Boolean)
)

function openMegaMenuDialog() {
  megaMenuItemsText.value = ''
  showMegaMenuDialog.value = true
}

function confirmAddMegaMenu() {
  if (megaMenuItemLines.value.length === 0) return
  addElement('megamenu', {
    items: megaMenuItemLines.value.map(label => ({ label, icon: '', columns: [] })),
  })
  showMegaMenuDialog.value = false
}

const showButtonDialog = ref(false)
const buttonLabelText   = ref('')

function nextButtonNumber() {
  return screens.value.flatMap(s => s.elements).filter(e => e.type === 'button').length + 1
}

function openButtonDialog() {
  buttonLabelText.value = ''
  showButtonDialog.value = true
}

function confirmAddButton() {
  const label = buttonLabelText.value.trim() || `Button ${nextButtonNumber()}`
  addElement('button', { label })
  showButtonDialog.value = false
}
</script>

<template>
  <p class="prop-section" style="margin-top:12px;">Screen</p>
  <div class="ce-field">
    <label class="ce-label">Name</label>
    <input class="ce-input" v-model="activeScreen.name" />
  </div>

  <div class="prop-hr" />
  <p class="prop-section">Background</p>
  <div class="ce-field">
    <div class="color-input-row">
      <input type="color" v-model="activeScreen.bg" class="color-native" />
      <span class="color-hex-val">{{ activeScreen.bg }}</span>
    </div>
  </div>

  <div class="prop-hr" />
  <p class="prop-section">Prototype</p>
  <div class="ce-field">
    <div
      class="entry-badge"
      :class="{ 'entry-active': activeScreen.id === startScreenId }"
      @click="startScreenId = activeScreen.id"
    >
      <i class="pi pi-play-circle" />
      <div class="entry-text">
        <span class="entry-label">
          {{ activeScreen.id === startScreenId ? 'Entry screen' : 'Set as entry' }}
        </span>
        <span class="entry-hint">
          {{ activeScreen.id === startScreenId ? 'Simulation starts here' : 'Click to make this the start' }}
        </span>
      </div>
      <i v-if="activeScreen.id === startScreenId" class="pi pi-check entry-check" />
    </div>
  </div>

  <div class="prop-hr" />
  <p class="prop-section">Add Component</p>
  <div class="comp-palette">
    <button class="comp-btn" @click="addElement('card')">
      <i class="pi pi-id-card" style="font-size:1.3rem;" />
      <span>Card</span>
    </button>
    <button class="comp-btn" @click="openButtonDialog">
      <i class="pi pi-mouse" style="font-size:1.3rem;" />
      <span>Button</span>
    </button>
    <button class="comp-btn" @click="openMegaMenuDialog">
      <i class="pi pi-bars" style="font-size:1.3rem;" />
      <span>Mega Menu</span>
    </button>
    <button class="comp-btn" @click="addElement('confirmdialog')">
      <i class="pi pi-shield" style="font-size:1.3rem;" />
      <span>Confirm Dialog</span>
    </button>
  </div>

  <div class="prop-hr" />
  <p class="prop-section">PrimeVue Components</p>
  <div class="ce-field">
    <input v-model="primeQuery" class="ce-input" placeholder="Search components…" />
  </div>
  <div class="prime-list">
    <template v-for="cat in filteredPrime" :key="cat.label">
      <p class="prime-cat">{{ cat.label }}</p>
      <button
        v-for="name in cat.items" :key="name"
        class="prime-item"
        @click="addElement('prime', { component: name })"
      >
        <i class="pi pi-plus" />
        <span>{{ name }}</span>
      </button>
    </template>
    <p v-if="!filteredPrime.length" class="prime-empty">No matches</p>
  </div>

  <Dialog
    v-model:visible="showMegaMenuDialog"
    header="Add Mega Menu"
    modal
    :style="{ width: '300px' }"
  >
    <p class="dlg-hint">What should this menu include? One item per line — it won't be created blank.</p>
    <textarea
      class="ce-textarea"
      v-model="megaMenuItemsText"
      rows="5"
      placeholder="Home&#10;Products&#10;About&#10;Contact"
      autofocus
      @keydown.enter.meta="confirmAddMegaMenu"
      @keydown.enter.ctrl="confirmAddMegaMenu"
    />
    <template #footer>
      <button class="dlg-btn secondary" @click="showMegaMenuDialog = false">Cancel</button>
      <button class="dlg-btn primary" :disabled="megaMenuItemLines.length === 0" @click="confirmAddMegaMenu">
        Create ({{ megaMenuItemLines.length }})
      </button>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="showButtonDialog"
    header="Add Button"
    modal
    :style="{ width: '280px' }"
  >
    <p class="dlg-hint">What should the button say? Leave blank to use "Button {{ nextButtonNumber() }}".</p>
    <input
      class="ce-input"
      v-model="buttonLabelText"
      :placeholder="`Button ${nextButtonNumber()}`"
      autofocus
      @keydown.enter="confirmAddButton"
    />
    <template #footer>
      <button class="dlg-btn secondary" @click="showButtonDialog = false">Cancel</button>
      <button class="dlg-btn primary" @click="confirmAddButton">Create</button>
    </template>
  </Dialog>
</template>

<style scoped>
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.prop-hr { height:1px; background:#2e2e2e; margin:10px 0; }
.ce-field { padding:0 12px 8px; }
.ce-label { display:block; font-size:10px; color:#666; margin-bottom:4px; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 8px; outline:none; font-family:inherit; user-select:text; }
.ce-input:focus { border-color:#7c5cfc; }
.color-input-row { display:flex; align-items:center; gap:8px; }
.color-native { width:28px; height:28px; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.color-native::-webkit-color-swatch-wrapper { padding:2px; }
.color-native::-webkit-color-swatch { border:none; border-radius:3px; }
.color-hex-val { font-size:12px; color:#aaa; font-family:monospace; }
.entry-badge { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; cursor:pointer; border:1px solid #333; background:#1e1e1e; transition:all .15s; }
.entry-badge:hover { border-color:#555; }
.entry-badge.entry-active { border-color:rgba(74,222,128,.4); background:rgba(74,222,128,.07); }
.entry-badge .pi-play-circle { font-size:1.2rem; color:#555; flex-shrink:0; transition:color .15s; }
.entry-badge.entry-active .pi-play-circle { color:#4ade80; }
.entry-text { flex:1; display:flex; flex-direction:column; gap:2px; }
.entry-label { font-size:12px; color:#ccc; font-weight:500; }
.entry-hint  { font-size:10px; color:#555; }
.entry-badge.entry-active .entry-label { color:#4ade80; }
.entry-check { font-size:11px; color:#4ade80; flex-shrink:0; }
.comp-palette { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:0 12px; }
.comp-btn { display:flex; flex-direction:column; align-items:center; gap:6px; padding:14px 8px; background:#1e1e1e; border:1px solid #333; border-radius:8px; color:#ccc; cursor:pointer; font-size:11px; font-family:inherit; transition:all .15s; }
.comp-btn:hover { border-color:#7c5cfc; color:#a78bfa; background:rgba(124,92,252,.08); }
.prime-list { padding:0 12px 12px; }
.prime-cat { font-size:9px; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:.08em; margin:10px 0 3px; padding:0 2px; }
.prime-item { display:flex; align-items:center; gap:8px; width:100%; padding:5px 8px; background:transparent; border:none; border-radius:5px; color:#bbb; font-size:12px; cursor:pointer; font-family:inherit; text-align:left; transition:all .12s; }
.prime-item:hover { background:rgba(124,92,252,.12); color:#d6c9ff; }
.prime-item .pi { font-size:10px; color:#555; transition:color .12s; }
.prime-item:hover .pi { color:#a78bfa; }
.prime-empty { font-size:11px; color:#555; padding:8px 2px; margin:0; }
.dlg-hint { font-size:12px; color:#999; margin:0 0 10px; line-height:1.5; }
.ce-textarea { width:100%; box-sizing:border-box; resize:vertical; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:6px 8px; outline:none; font-family:inherit; line-height:1.5; user-select:text; }
.ce-textarea:focus { border-color:#7c5cfc; }
.dlg-btn { padding:7px 14px; border-radius:6px; border:none; cursor:pointer; font-size:12px; font-family:inherit; transition:all .15s; }
.dlg-btn.secondary { background:#2a2a2a; color:#ccc; border:1px solid #3a3a3a; }
.dlg-btn.secondary:hover { background:#333; color:#fff; }
.dlg-btn.primary { background:#7c5cfc; color:white; margin-left:8px; }
.dlg-btn.primary:hover { background:#6d4fe0; }
.dlg-btn.primary:disabled { background:#3a3a3a; color:#666; cursor:not-allowed; }
</style>

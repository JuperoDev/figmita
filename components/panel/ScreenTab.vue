<script setup>
const { activeScreen, startScreenId } = useScreens()
const { addElement } = useElements()
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
    <button class="comp-btn comp-btn-soon" disabled title="Coming soon">
      <i class="pi pi-image" style="font-size:1.3rem;" />
      <span>Image</span>
    </button>
    <button class="comp-btn comp-btn-soon" disabled title="Coming soon">
      <i class="pi pi-align-left" style="font-size:1.3rem;" />
      <span>Text</span>
    </button>
    <button class="comp-btn comp-btn-soon" disabled title="Coming soon">
      <i class="pi pi-table" style="font-size:1.3rem;" />
      <span>Table</span>
    </button>
  </div>
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
.comp-btn-soon { opacity:.35; cursor:not-allowed !important; }
.comp-btn-soon:hover { border-color:#333; color:#ccc; background:#1e1e1e; }
</style>

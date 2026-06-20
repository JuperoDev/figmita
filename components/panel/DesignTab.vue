<script setup>
const { selectedEl } = useElements()
const { activeElement, deleteEl } = useElements()
</script>

<template>
  <template v-if="activeElement">
    <p class="prop-section">Layout</p>
    <div class="prop-grid">
      <div class="prop-field"><label>W</label><input class="prop-inp" value="360" readonly /></div>
      <div class="prop-field"><label>H</label><input class="prop-inp" value="auto" readonly /></div>
      <div class="prop-field"><label>X</label><input class="prop-inp" :value="activeElement.pos.x" readonly /></div>
      <div class="prop-field"><label>Y</label><input class="prop-inp" :value="activeElement.pos.y" readonly /></div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Component</p>
    <div class="component-badge"><i class="pi pi-box" /><span>PrimeVue / Card</span></div>

    <div class="prop-hr" />
    <div class="ce-field">
      <button class="danger-btn" @click="deleteEl(selectedEl.screenId, selectedEl.elId)">
        <i class="pi pi-trash" /> Delete element
      </button>
    </div>
  </template>
</template>

<style scoped>
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.prop-hr { height:1px; background:#2e2e2e; margin:10px 0; }
.prop-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:0 12px; }
.prop-field { display:flex; align-items:center; background:#1e1e1e; border:1px solid #333; border-radius:4px; overflow:hidden; }
.prop-field label { font-size:10px; color:#555; padding:0 5px; white-space:nowrap; }
.prop-inp { flex:1; background:transparent; border:none; outline:none; color:#d0d0d0; font-size:12px; padding:5px 5px 5px 0; width:0; font-variant-numeric:tabular-nums; }
.component-badge { display:flex; align-items:center; gap:8px; padding:6px 8px; margin:0 12px; background:rgba(52,211,153,.08); border:1px solid rgba(52,211,153,.25); border-radius:4px; font-size:12px; color:#34d399; }
.ce-field { padding:0 12px 8px; }
.danger-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:8px; background:transparent; border:1px solid #5a2020; color:#f87171; border-radius:6px; cursor:pointer; font-size:12px; font-family:inherit; transition:all .15s; }
.danger-btn:hover { background:#3a1e1e; border-color:#f87171; }
</style>

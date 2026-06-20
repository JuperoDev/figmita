<script setup>
const { protoJson, copyJson, copyLink } = useShare()
</script>

<template>
  <div class="json-panel">
    <pre class="json-view">{{ protoJson }}</pre>
    <div class="json-actions">
      <button class="json-btn" @click="copyJson"><i class="pi pi-copy" /> Copy JSON</button>
      <button class="json-btn secondary" @click="copyLink"><i class="pi pi-link" /> Copy link</button>
    </div>
  </div>
</template>

<style scoped>
.json-panel { display:flex; flex-direction:column; padding-bottom:12px; }
.json-view { margin:8px 12px 0; overflow-y:auto; background:#1a1a1a; border:1px solid #2e2e2e; border-radius:6px; padding:12px; font-size:11px; font-family:'JetBrains Mono','Fira Code',monospace; color:#a5f3fc; line-height:1.6; white-space:pre; user-select:text; max-height:480px; }
.json-actions { display:flex; gap:6px; padding:10px 12px 0; }
.json-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:7px; border-radius:6px; border:none; cursor:pointer; font-size:12px; font-family:inherit; background:#7c5cfc; color:white; transition:background .15s; }
.json-btn:hover { background:#6d4fe0; }
.json-btn.secondary { background:#2a2a2a; color:#ccc; border:1px solid #3a3a3a; }
.json-btn.secondary:hover { background:#333; color:#fff; }
</style>

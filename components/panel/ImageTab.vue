<script setup>
const { activeElement } = useElements()

function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { activeElement.value.config.src = reader.result }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div v-if="activeElement" class="image-editor">
    <p class="prop-section" style="margin-top:12px;">Image</p>
    <div class="ce-field">
      <label class="ce-label">Name</label>
      <input class="ce-input" v-model="activeElement.name" />
    </div>
    <div class="ce-field">
      <label class="ce-label">URL</label>
      <input class="ce-input" v-model="activeElement.config.src" placeholder="https://… or upload below" />
    </div>
    <div class="ce-field">
      <input type="file" accept="image/*" class="file-input" @change="onFile" />
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Width</label>
        <input type="number" class="ce-input" min="8" v-model.number="activeElement.config.w" />
      </div>
      <div>
        <label class="ce-label">Height</label>
        <input type="number" class="ce-input" min="8" v-model.number="activeElement.config.h" />
      </div>
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Fit</label>
        <select class="dark-select" v-model="activeElement.config.fit">
          <option value="cover">cover</option>
          <option value="contain">contain</option>
          <option value="fill">stretch</option>
        </select>
      </div>
      <div>
        <label class="ce-label">Radius</label>
        <input type="number" class="ce-input" min="0" v-model.number="activeElement.config.radius" />
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Alt text</label>
      <input class="ce-input" v-model="activeElement.config.alt" />
    </div>
  </div>
</template>

<style scoped>
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.ce-field { padding:0 12px 8px; }
.ce-field.two-col { display:flex; gap:8px; }
.ce-field.two-col > div { flex:1; min-width:0; }
.ce-label { display:block; font-size:10px; color:#666; margin-bottom:4px; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 8px; outline:none; font-family:inherit; user-select:text; }
.ce-input:focus { border-color:#7c5cfc; }
.dark-select { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 6px; outline:none; font-family:inherit; cursor:pointer; }
.file-input { width:100%; font-size:11px; color:#888; }
</style>

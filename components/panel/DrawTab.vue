<script setup>
const { activeElement } = useElements()
</script>

<template>
  <div v-if="activeElement" class="draw-editor">
    <p class="prop-section" style="margin-top:12px;">Drawing</p>
    <div class="ce-field">
      <label class="ce-label">Name</label>
      <input class="ce-input" v-model="activeElement.name" />
    </div>
    <div class="ce-field">
      <label class="ce-label">Stroke</label>
      <div class="color-row">
        <input type="color" class="color-native" v-model="activeElement.config.stroke" />
        <input class="ce-input" v-model="activeElement.config.stroke" />
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Stroke width — {{ activeElement.config.strokeWidth }}px</label>
      <input type="range" class="range-input" min="1" max="24" v-model.number="activeElement.config.strokeWidth" />
    </div>
    <div class="ce-field">
      <label class="check-row">
        <input type="checkbox" v-model="activeElement.config.smooth" />
        <span>Smooth (pen)</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.ce-field { padding:0 12px 8px; }
.ce-label { display:block; font-size:10px; color:#666; margin-bottom:4px; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 8px; outline:none; font-family:inherit; user-select:text; }
.ce-input:focus { border-color:#7c5cfc; }
.color-row { display:flex; align-items:center; gap:6px; }
.color-native { width:28px; height:28px; flex-shrink:0; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.color-native::-webkit-color-swatch-wrapper { padding:2px; }
.color-native::-webkit-color-swatch { border:none; border-radius:3px; }
.range-input { width:100%; accent-color:#7c5cfc; cursor:pointer; }
.check-row { display:flex; align-items:center; gap:8px; font-size:12px; color:#ccc; cursor:pointer; }
.check-row input { accent-color:#7c5cfc; cursor:pointer; margin:0; }
</style>

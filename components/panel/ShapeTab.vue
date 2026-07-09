<script setup>
const { activeElement } = useElements()
</script>

<template>
  <div v-if="activeElement" class="shape-editor">
    <p class="prop-section" style="margin-top:12px;">{{ activeElement.config.kind === 'ellipse' ? 'Ellipse' : 'Polygon' }}</p>
    <div class="ce-field">
      <label class="ce-label">Name</label>
      <input class="ce-input" v-model="activeElement.name" />
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
    <div v-if="activeElement.config.kind === 'polygon'" class="ce-field">
      <label class="ce-label">Sides — {{ activeElement.config.sides }}</label>
      <input type="range" class="range-input" min="3" max="12" v-model.number="activeElement.config.sides" />
    </div>

    <div class="ce-field">
      <label class="ce-label">Fill</label>
      <div class="color-row">
        <input type="color" class="color-native" v-model="activeElement.config.fill" />
        <input class="ce-input" v-model="activeElement.config.fill" />
      </div>
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Stroke</label>
        <input type="color" class="color-native wide" v-model="activeElement.config.stroke" />
      </div>
      <div>
        <label class="ce-label">Stroke width</label>
        <input type="number" class="ce-input" min="0" v-model.number="activeElement.config.strokeWidth" />
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Opacity — {{ activeElement.config.opacity }}%</label>
      <input type="range" class="range-input" min="0" max="100" v-model.number="activeElement.config.opacity" />
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
.color-row { display:flex; align-items:center; gap:6px; }
.color-native { width:28px; height:28px; flex-shrink:0; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.color-native::-webkit-color-swatch-wrapper { padding:2px; }
.color-native::-webkit-color-swatch { border:none; border-radius:3px; }
.color-native.wide { width:100%; height:28px; }
.range-input { width:100%; accent-color:#7c5cfc; cursor:pointer; }
</style>

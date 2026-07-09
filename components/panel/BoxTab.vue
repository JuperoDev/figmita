<script setup>
const { activeElement } = useElements()

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'sm',   label: 'Small' },
  { value: 'md',   label: 'Medium' },
  { value: 'lg',   label: 'Large' },
]
</script>

<template>
  <div v-if="activeElement" class="box-editor">
    <p class="prop-section" style="margin-top:12px;">Box</p>
    <div class="ce-field">
      <label class="ce-label">Name</label>
      <input class="ce-input" v-model="activeElement.name" />
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">X</label>
        <input type="number" class="ce-input" v-model.number="activeElement.pos.x" />
      </div>
      <div>
        <label class="ce-label">Y</label>
        <input type="number" class="ce-input" v-model.number="activeElement.pos.y" />
      </div>
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

    <div class="prop-hr" />
    <p class="prop-section">Fill</p>
    <div class="ce-field">
      <div class="color-row">
        <input type="color" class="color-native" v-model="activeElement.config.fill" />
        <input class="ce-input" v-model="activeElement.config.fill" />
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Opacity — {{ activeElement.config.opacity }}%</label>
      <input type="range" class="range-input" min="0" max="100" v-model.number="activeElement.config.opacity" />
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Border</p>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Width</label>
        <input type="number" class="ce-input" min="0" v-model.number="activeElement.config.borderWidth" />
      </div>
      <div>
        <label class="ce-label">Style</label>
        <select class="dark-select" v-model="activeElement.config.borderStyle">
          <option value="solid">solid</option>
          <option value="dashed">dashed</option>
          <option value="dotted">dotted</option>
        </select>
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Color</label>
      <div class="color-row">
        <input type="color" class="color-native" v-model="activeElement.config.borderColor" />
        <input class="ce-input" v-model="activeElement.config.borderColor" />
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Radius — {{ activeElement.config.radius }}px</label>
      <input type="range" class="range-input" min="0" max="100" v-model.number="activeElement.config.radius" />
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Shadow</p>
    <div class="ce-field">
      <select class="dark-select" v-model="activeElement.config.shadow">
        <option v-for="o in shadowOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Text</p>
    <div class="ce-field">
      <textarea class="ce-textarea" rows="2" v-model="activeElement.config.text" placeholder="Optional label…" />
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Size</label>
        <input type="number" class="ce-input" min="8" v-model.number="activeElement.config.fontSize" />
      </div>
      <div>
        <label class="ce-label">Align</label>
        <select class="dark-select" v-model="activeElement.config.align">
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Color</label>
      <div class="color-row">
        <input type="color" class="color-native" v-model="activeElement.config.textColor" />
        <input class="ce-input" v-model="activeElement.config.textColor" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.prop-hr { height:1px; background:#2e2e2e; margin:10px 0; }
.ce-field { padding:0 12px 8px; }
.ce-field.two-col { display:flex; gap:8px; }
.ce-field.two-col > div { flex:1; min-width:0; }
.ce-label { display:block; font-size:10px; color:#666; margin-bottom:4px; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 8px; outline:none; font-family:inherit; user-select:text; }
.ce-input:focus { border-color:#7c5cfc; }
.ce-textarea { width:100%; box-sizing:border-box; resize:vertical; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:6px 8px; outline:none; font-family:inherit; line-height:1.5; user-select:text; }
.ce-textarea:focus { border-color:#7c5cfc; }
.dark-select { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 6px; outline:none; font-family:inherit; cursor:pointer; }
.dark-select:focus { border-color:#7c5cfc; }
.color-row { display:flex; align-items:center; gap:6px; }
.color-native { width:28px; height:28px; flex-shrink:0; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.color-native::-webkit-color-swatch-wrapper { padding:2px; }
.color-native::-webkit-color-swatch { border:none; border-radius:3px; }
.range-input { width:100%; accent-color:#7c5cfc; cursor:pointer; }
</style>

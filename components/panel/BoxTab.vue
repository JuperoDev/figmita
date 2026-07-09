<script setup>
import { computed, watchEffect } from 'vue'

const { activeElement } = useElements()

// Boxes created before per-side borders / per-corner radii / fill modes
watchEffect(() => {
  const c = activeElement.value?.config
  if (!c || activeElement.value.type !== 'box') return
  c.sides ??= { t: true, r: true, b: true, l: true }
  c.radii ??= { tl: c.radius ?? 0, tr: c.radius ?? 0, br: c.radius ?? 0, bl: c.radius ?? 0 }
  c.fillType ??= 'solid'
  c.gradFrom ??= '#7c5cfc'
  c.gradTo ??= '#34d399'
  c.gradAngle ??= 135
  c.imageSrc ??= ''
  c.imageFit ??= 'cover'
})

const cfg = computed(() => activeElement.value?.config)

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'sm',   label: 'Small' },
  { value: 'md',   label: 'Medium' },
  { value: 'lg',   label: 'Large' },
]

const allRadius = computed({
  get: () => cfg.value?.radii?.tl ?? 0,
  set: (v) => {
    if (cfg.value?.radii) cfg.value.radii = { tl: v, tr: v, br: v, bl: v }
  },
})

function onImageFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { cfg.value.imageSrc = reader.result }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div v-if="activeElement && cfg?.sides" class="box-editor">
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
        <input type="number" class="ce-input" min="8" v-model.number="cfg.w" />
      </div>
      <div>
        <label class="ce-label">Height</label>
        <input type="number" class="ce-input" min="8" v-model.number="cfg.h" />
      </div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Fill</p>
    <div class="ce-field">
      <div class="seg-row">
        <button
          v-for="t in ['solid', 'gradient', 'image']" :key="t"
          class="seg-btn" :class="{ active: cfg.fillType === t }"
          @click="cfg.fillType = t"
        >{{ t }}</button>
      </div>
    </div>
    <template v-if="cfg.fillType === 'solid'">
      <div class="ce-field">
        <div class="color-row">
          <input type="color" class="color-native" v-model="cfg.fill" />
          <input class="ce-input" v-model="cfg.fill" />
        </div>
      </div>
    </template>
    <template v-else-if="cfg.fillType === 'gradient'">
      <div class="ce-field two-col">
        <div>
          <label class="ce-label">From</label>
          <input type="color" class="color-native wide" v-model="cfg.gradFrom" />
        </div>
        <div>
          <label class="ce-label">To</label>
          <input type="color" class="color-native wide" v-model="cfg.gradTo" />
        </div>
      </div>
      <div class="ce-field">
        <label class="ce-label">Angle — {{ cfg.gradAngle }}°</label>
        <input type="range" class="range-input" min="0" max="360" v-model.number="cfg.gradAngle" />
      </div>
    </template>
    <template v-else>
      <div class="ce-field">
        <label class="ce-label">Image URL</label>
        <input class="ce-input" v-model="cfg.imageSrc" placeholder="https://… or upload below" />
      </div>
      <div class="ce-field">
        <input type="file" accept="image/*" class="file-input" @change="onImageFile" />
      </div>
      <div class="ce-field">
        <label class="ce-label">Fit</label>
        <select class="dark-select" v-model="cfg.imageFit">
          <option value="cover">cover</option>
          <option value="contain">contain</option>
          <option value="100% 100%">stretch</option>
        </select>
      </div>
    </template>
    <div class="ce-field">
      <label class="ce-label">Opacity — {{ cfg.opacity }}%</label>
      <input type="range" class="range-input" min="0" max="100" v-model.number="cfg.opacity" />
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Borders &amp; Corners</p>
    <!-- Figma-style diagram: corner radius inputs + per-side border toggles -->
    <div class="ce-field">
      <div class="border-grid">
        <input type="number" class="corner-input" min="0" v-model.number="cfg.radii.tl" title="Top-left radius" />
        <button class="side-toggle side-h" :class="{ on: cfg.sides.t }" title="Top border" @click="cfg.sides.t = !cfg.sides.t" />
        <input type="number" class="corner-input" min="0" v-model.number="cfg.radii.tr" title="Top-right radius" />

        <button class="side-toggle side-v" :class="{ on: cfg.sides.l }" title="Left border" @click="cfg.sides.l = !cfg.sides.l" />
        <div
          class="border-preview"
          :style="{
            borderTop:    cfg.sides.t ? '2px solid #a78bfa' : '2px dashed #3a3a3a',
            borderRight:  cfg.sides.r ? '2px solid #a78bfa' : '2px dashed #3a3a3a',
            borderBottom: cfg.sides.b ? '2px solid #a78bfa' : '2px dashed #3a3a3a',
            borderLeft:   cfg.sides.l ? '2px solid #a78bfa' : '2px dashed #3a3a3a',
            borderRadius: `${Math.min(14, cfg.radii.tl)}px ${Math.min(14, cfg.radii.tr)}px ${Math.min(14, cfg.radii.br)}px ${Math.min(14, cfg.radii.bl)}px`,
          }"
        />
        <button class="side-toggle side-v" :class="{ on: cfg.sides.r }" title="Right border" @click="cfg.sides.r = !cfg.sides.r" />

        <input type="number" class="corner-input" min="0" v-model.number="cfg.radii.bl" title="Bottom-left radius" />
        <button class="side-toggle side-h" :class="{ on: cfg.sides.b }" title="Bottom border" @click="cfg.sides.b = !cfg.sides.b" />
        <input type="number" class="corner-input" min="0" v-model.number="cfg.radii.br" title="Bottom-right radius" />
      </div>
      <p class="diagram-hint">Click edges to toggle borders — corners set each radius</p>
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Border width</label>
        <input type="number" class="ce-input" min="0" v-model.number="cfg.borderWidth" />
      </div>
      <div>
        <label class="ce-label">Style</label>
        <select class="dark-select" v-model="cfg.borderStyle">
          <option value="solid">solid</option>
          <option value="dashed">dashed</option>
          <option value="dotted">dotted</option>
        </select>
      </div>
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Border color</label>
        <input type="color" class="color-native wide" v-model="cfg.borderColor" />
      </div>
      <div>
        <label class="ce-label">All corners</label>
        <input type="number" class="ce-input" min="0" v-model.number="allRadius" />
      </div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Shadow</p>
    <div class="ce-field">
      <select class="dark-select" v-model="cfg.shadow">
        <option v-for="o in shadowOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Text</p>
    <div class="ce-field">
      <textarea class="ce-textarea" rows="2" v-model="cfg.text" placeholder="Optional label…" />
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Size</label>
        <input type="number" class="ce-input" min="8" v-model.number="cfg.fontSize" />
      </div>
      <div>
        <label class="ce-label">Align</label>
        <select class="dark-select" v-model="cfg.align">
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Color</label>
      <div class="color-row">
        <input type="color" class="color-native" v-model="cfg.textColor" />
        <input class="ce-input" v-model="cfg.textColor" />
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
.color-native.wide { width:100%; height:28px; }
.range-input { width:100%; accent-color:#7c5cfc; cursor:pointer; }
.file-input { width:100%; font-size:11px; color:#888; }
.seg-row { display:flex; gap:4px; }
.seg-btn { flex:1; padding:5px 0; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#aaa; font-size:11px; cursor:pointer; font-family:inherit; text-transform:capitalize; transition:all .12s; }
.seg-btn.active { background:#3d3075; border-color:#7c5cfc; color:#fff; }

/* Figma-style border/corner diagram */
.border-grid {
  display:grid;
  grid-template-columns: 44px 1fr 44px;
  grid-template-rows: 26px 56px 26px;
  gap:6px; align-items:center; justify-items:center;
}
.corner-input { width:44px; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:11px; padding:4px 4px; outline:none; font-family:inherit; text-align:center; }
.corner-input:focus { border-color:#7c5cfc; }
.side-toggle { background:#1e1e1e; border:1px solid #333; border-radius:4px; cursor:pointer; transition:all .12s; padding:0; }
.side-toggle.side-h { width:56px; height:12px; }
.side-toggle.side-v { width:12px; height:44px; }
.side-toggle.on { background:#7c5cfc; border-color:#a78bfa; }
.side-toggle:hover { border-color:#7c5cfc; }
.border-preview { width:60px; height:48px; box-sizing:border-box; background:#252525; transition:border-radius .15s; }
.diagram-hint { font-size:10px; color:#555; text-align:center; margin:6px 0 0; }
</style>

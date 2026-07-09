<script setup>
const { activeElement } = useElements()

// Choosing a tag applies its typographic preset; size/weight stay editable
const TAG_PRESETS = {
  h1:    { fontSize: 36, weight: 800 },
  h2:    { fontSize: 28, weight: 700 },
  h3:    { fontSize: 22, weight: 700 },
  h4:    { fontSize: 18, weight: 600 },
  p:     { fontSize: 14, weight: 400 },
  small: { fontSize: 12, weight: 400 },
}

function applyTag(tag) {
  const c = activeElement.value?.config
  if (!c) return
  c.tag = tag
  Object.assign(c, TAG_PRESETS[tag])
}

const weightOptions = [300, 400, 500, 600, 700, 800, 900]
</script>

<template>
  <div v-if="activeElement" class="text-editor">
    <p class="prop-section" style="margin-top:12px;">Text</p>
    <div class="ce-field">
      <label class="ce-label">Name</label>
      <input class="ce-input" v-model="activeElement.name" />
    </div>
    <div class="ce-field">
      <label class="ce-label">Content</label>
      <textarea class="ce-textarea" rows="3" v-model="activeElement.config.text" />
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Style</p>
    <div class="ce-field">
      <label class="ce-label">Tag</label>
      <div class="tag-row">
        <button
          v-for="(preset, tag) in TAG_PRESETS" :key="tag"
          class="tag-btn" :class="{ active: activeElement.config.tag === tag }"
          @click="applyTag(tag)"
        >{{ tag }}</button>
      </div>
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Size</label>
        <input type="number" class="ce-input" min="6" v-model.number="activeElement.config.fontSize" />
      </div>
      <div>
        <label class="ce-label">Weight</label>
        <select class="dark-select" v-model.number="activeElement.config.weight">
          <option v-for="w in weightOptions" :key="w" :value="w">{{ w }}</option>
        </select>
      </div>
    </div>
    <div class="ce-field two-col">
      <div>
        <label class="ce-label">Align</label>
        <select class="dark-select" v-model="activeElement.config.align">
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </div>
      <div>
        <label class="ce-label">Spacing</label>
        <input type="number" class="ce-input" step="0.5" v-model.number="activeElement.config.letterSpacing" />
      </div>
    </div>
    <div class="ce-field">
      <label class="check-row">
        <input type="checkbox" v-model="activeElement.config.italic" />
        <span>Italic</span>
      </label>
    </div>
    <div class="ce-field">
      <label class="ce-label">Color</label>
      <div class="color-row">
        <input type="color" class="color-native" v-model="activeElement.config.color" />
        <input class="ce-input" v-model="activeElement.config.color" />
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
.tag-row { display:flex; gap:4px; flex-wrap:wrap; }
.tag-btn { flex:1; min-width:34px; padding:5px 0; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#aaa; font-size:11px; cursor:pointer; font-family:inherit; transition:all .12s; }
.tag-btn:hover { border-color:#555; color:#eee; }
.tag-btn.active { background:#3d3075; border-color:#7c5cfc; color:#fff; }
.check-row { display:flex; align-items:center; gap:8px; font-size:12px; color:#ccc; cursor:pointer; }
.check-row input { accent-color:#7c5cfc; cursor:pointer; margin:0; }
.color-row { display:flex; align-items:center; gap:6px; }
.color-native { width:28px; height:28px; flex-shrink:0; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.color-native::-webkit-color-swatch-wrapper { padding:2px; }
.color-native::-webkit-color-swatch { border:none; border-radius:3px; }
</style>

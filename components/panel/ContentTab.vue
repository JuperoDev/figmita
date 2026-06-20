<script setup>
const { activeElement } = useElements()
const { newFeature, iconOptions, severityOptions, addFeature, removeFeature, updateFeature } = useEditor()
</script>

<template>
  <div v-if="activeElement" class="content-editor">
    <p class="prop-section">Hero</p>
    <div class="ce-field">
      <label class="ce-label">Gradient from</label>
      <div class="color-input-row">
        <input type="color" v-model="activeElement.config.heroFrom" class="color-native" />
        <span class="color-hex-val">{{ activeElement.config.heroFrom }}</span>
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Gradient to</label>
      <div class="color-input-row">
        <input type="color" v-model="activeElement.config.heroTo" class="color-native" />
        <span class="color-hex-val">{{ activeElement.config.heroTo }}</span>
      </div>
    </div>
    <div class="ce-field">
      <label class="ce-label">Icon</label>
      <select v-model="activeElement.config.heroIcon" class="dark-select">
        <option v-for="o in iconOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Card</p>
    <div class="ce-field"><label class="ce-label">Title</label><input class="ce-input" v-model="activeElement.config.title" /></div>
    <div class="ce-field"><label class="ce-label">Subtitle</label><input class="ce-input" v-model="activeElement.config.subtitle" /></div>
    <div class="ce-field">
      <label class="ce-label">Badge</label>
      <div style="display:flex;gap:4px;">
        <input class="ce-input" v-model="activeElement.config.badgeLabel" style="flex:1;" placeholder="label" />
        <select v-model="activeElement.config.badgeSeverity" class="dark-select" style="width:84px;">
          <option v-for="s in severityOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Description</p>
    <div class="ce-field">
      <textarea class="ce-textarea" v-model="activeElement.config.description" rows="3" />
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Pricing</p>
    <div class="ce-field">
      <div style="display:flex;gap:6px;">
        <div style="flex:1;"><label class="ce-label">Amount</label><input class="ce-input" v-model="activeElement.config.price" /></div>
        <div style="flex:1;"><label class="ce-label">Period</label><input class="ce-input" v-model="activeElement.config.period" /></div>
      </div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Features</p>
    <div class="ce-field">
      <div v-for="(f, i) in activeElement.config.features" :key="i" class="feature-row">
        <input class="ce-input" :value="f" @input="updateFeature(i, $event.target.value)" style="flex:1;" />
        <button class="feat-del" @click="removeFeature(i)"><i class="pi pi-times" /></button>
      </div>
      <div class="feature-row" style="margin-top:4px;">
        <input class="ce-input" v-model="newFeature" placeholder="Add feature…" style="flex:1;" @keydown.enter="addFeature" />
        <button class="feat-add" @click="addFeature"><i class="pi pi-plus" /></button>
      </div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Button</p>
    <div class="ce-field">
      <label class="ce-label">Primary label</label>
      <input class="ce-input" v-model="activeElement.config.primaryBtn" />
    </div>
  </div>
</template>

<style scoped>
.content-editor { padding-bottom:12px; }
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.prop-hr { height:1px; background:#2e2e2e; margin:10px 0; }
.ce-field { padding:0 12px 8px; }
.ce-label { display:block; font-size:10px; color:#666; margin-bottom:4px; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 8px; outline:none; font-family:inherit; user-select:text; }
.ce-input:focus { border-color:#7c5cfc; }
.ce-textarea { width:100%; box-sizing:border-box; resize:vertical; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:6px 8px; outline:none; font-family:inherit; line-height:1.5; user-select:text; }
.ce-textarea:focus { border-color:#7c5cfc; }
.dark-select { background:#1e1e1e; border:1px solid #333; color:#d0d0d0; border-radius:4px; padding:5px 8px; font-size:12px; cursor:pointer; outline:none; width:100%; user-select:text; }
.dark-select:focus { border-color:#7c5cfc; }
.color-input-row { display:flex; align-items:center; gap:8px; }
.color-native { width:28px; height:28px; padding:0; border:1px solid #444; border-radius:4px; cursor:pointer; background:none; -webkit-appearance:none; }
.color-native::-webkit-color-swatch-wrapper { padding:2px; }
.color-native::-webkit-color-swatch { border:none; border-radius:3px; }
.color-hex-val { font-size:12px; color:#aaa; font-family:monospace; }
.feature-row { display:flex; align-items:center; gap:4px; margin-bottom:4px; }
.feat-del { width:24px; height:24px; display:flex; align-items:center; justify-content:center; background:transparent; border:none; color:#555; cursor:pointer; border-radius:3px; flex-shrink:0; }
.feat-del:hover { background:#3a1e1e; color:#f87171; }
.feat-add { width:24px; height:24px; display:flex; align-items:center; justify-content:center; background:transparent; border:1px solid #3a3a3a; color:#666; cursor:pointer; border-radius:3px; flex-shrink:0; }
.feat-add:hover { background:#2a2a2a; color:#a78bfa; border-color:#7c5cfc; }
</style>

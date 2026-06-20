<script setup>
const { selectedSub, activeElement } = useElements()
const { otherScreens, confirmDialogElements } = useRightPanel()
const { actionOptions } = useEditor()
const { playMode, startPlay, handlePlayBtn } = usePlayMode()
</script>

<template>
  <template v-if="activeElement">
    <div class="breadcrumb">
      <template v-if="selectedSub === 'btn'">
        <span class="bc-link" @click="selectedSub = null">{{ activeElement.config.title }}</span>
        <i class="pi pi-angle-right bc-sep" />
        <span class="bc-current">{{ activeElement.config.primaryBtn }}</span>
      </template>
      <span v-else class="bc-current">{{ activeElement.name || 'Button' }}</span>
    </div>

    <p class="prop-section">Trigger</p>
    <div class="ia-flow">
      <div class="ia-chip trigger-chip"><i class="pi pi-mouse" />On Click</div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Action</p>
    <div class="ce-field">
      <select class="dark-select" v-model="activeElement.interaction.action">
        <option v-for="o in actionOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <template v-if="activeElement.interaction.action === 'alert' || activeElement.interaction.action === 'alert+navigate'">
      <div class="prop-hr" />
      <p class="prop-section">Message</p>
      <div class="ce-field">
        <textarea class="ce-textarea" v-model="activeElement.interaction.alertText" rows="3" placeholder="Enter message…" />
      </div>
    </template>

    <template v-if="activeElement.interaction.action === 'navigate' || activeElement.interaction.action === 'alert+navigate'">
      <div class="prop-hr" />
      <p class="prop-section">Navigate to</p>
      <div class="ce-field">
        <select class="dark-select" v-model="activeElement.interaction.navigateTo">
          <option :value="null" disabled>Choose screen…</option>
          <option v-for="s in otherScreens" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
        <p v-if="otherScreens.length === 0" class="hint-text">Add another screen first</p>
      </div>
    </template>

    <template v-if="activeElement.interaction.action === 'confirm'">
      <div class="prop-hr" />
      <p class="prop-section">Confirm dialog</p>
      <div class="ce-field">
        <select class="dark-select" v-model="activeElement.interaction.confirmTarget">
          <option :value="null" disabled>Choose dialog…</option>
          <option v-for="d in confirmDialogElements" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
        <p v-if="confirmDialogElements.length === 0" class="hint-text">Add a Confirm Dialog component first</p>
      </div>

      <div class="prop-hr" />
      <p class="prop-section">On accept, navigate to</p>
      <div class="ce-field">
        <select class="dark-select" v-model="activeElement.interaction.confirmAcceptNavigateTo">
          <option :value="null">Stay on this screen</option>
          <option v-for="s in otherScreens" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
    </template>

    <div class="prop-hr" />
    <div class="ia-test-area">
      <button class="test-btn" @click="playMode ? handlePlayBtn(activeElement) : startPlay()">
        <i class="pi pi-play" /> Test interaction
      </button>
      <p class="test-hint">Press <kbd>P</kbd> to enter play mode</p>
    </div>
  </template>
</template>

<style scoped>
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.prop-hr { height:1px; background:#2e2e2e; margin:10px 0; }
.ce-field { padding:0 12px 8px; }
.ce-textarea { width:100%; box-sizing:border-box; resize:vertical; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:6px 8px; outline:none; font-family:inherit; line-height:1.5; user-select:text; }
.ce-textarea:focus { border-color:#7c5cfc; }
.dark-select { background:#1e1e1e; border:1px solid #333; color:#d0d0d0; border-radius:4px; padding:5px 8px; font-size:12px; cursor:pointer; outline:none; width:100%; user-select:text; }
.dark-select:focus { border-color:#7c5cfc; }
.hint-text { font-size:11px; color:#555; margin:4px 0 0; }
.breadcrumb { display:flex; align-items:center; gap:4px; padding:10px 12px 8px; border-bottom:1px solid #2e2e2e; font-size:12px; }
.bc-link { color:#888; cursor:pointer; }
.bc-link:hover { color:#a78bfa; }
.bc-sep { font-size:10px; color:#444; }
.bc-current { color:#f0f0f0; font-weight:500; }
.ia-flow { padding:4px 12px 0; }
.ia-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border-radius:6px; font-size:12px; font-weight:500; }
.trigger-chip { background:rgba(124,92,252,.15); color:#a78bfa; border:1px solid rgba(124,92,252,.3); }
.ia-test-area { padding:0 12px; }
.test-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:9px 0; background:#7c5cfc; color:white; border:none; border-radius:7px; font-size:13px; font-weight:500; cursor:pointer; font-family:inherit; transition:background .15s; }
.test-btn:hover { background:#6d4fe0; }
.test-hint { font-size:11px; color:#555; text-align:center; margin:8px 0 0; }
.test-hint kbd { background:#333; border:1px solid #444; border-radius:3px; padding:1px 5px; font-size:11px; font-family:monospace; color:#ccc; }
</style>

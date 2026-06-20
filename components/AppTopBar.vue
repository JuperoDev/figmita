<script setup>
const { zoomLabel } = useCanvas()
const { playMode, startPlay } = usePlayMode()
const { copyLink } = useShare()
</script>

<template>
  <header class="top-bar">
    <div class="top-left">
      <div class="app-logo">F</div>
      <span class="file-name">figmita</span>
      <span class="file-path">/ Designs</span>
    </div>

    <div class="toolbar">
      <button class="tool-btn" :class="{ active: !playMode }" @click="playMode = false">
        <i class="pi pi-arrows-alt" />
      </button>
      <button class="tool-btn"><i class="pi pi-hand" /></button>
      <div class="tool-sep" />
      <button class="tool-btn"><i class="pi pi-stop" /></button>
      <button class="tool-btn"><i class="pi pi-box" /></button>
      <div class="tool-sep" />
      <button
        class="play-btn"
        :class="{ 'play-active': playMode }"
        title="Play (P)"
        @click="playMode ? (playMode = false) : startPlay()"
      >
        <i :class="playMode ? 'pi pi-stop-circle' : 'pi pi-play'" />
        {{ playMode ? 'Stop' : 'Play' }}
      </button>
    </div>

    <div class="top-right">
      <span class="zoom-chip">{{ zoomLabel }}</span>
      <Button size="small" label="Share" icon="pi pi-share-alt" rounded
        style="height:30px;font-size:12px;" @click="copyLink" />
    </div>
  </header>
</template>

<style scoped>
.top-bar { display:flex; align-items:center; justify-content:space-between; height:48px; padding:0 12px; background:#2c2c2c; border-bottom:1px solid #383838; flex-shrink:0; z-index:10; }
.top-left  { display:flex; align-items:center; gap:10px; min-width:180px; }
.top-right { display:flex; align-items:center; gap:12px; min-width:180px; justify-content:flex-end; }
.app-logo { width:28px; height:28px; background:linear-gradient(135deg,#7c5cfc,#a78bfa); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; color:white; flex-shrink:0; }
.file-name { font-weight:600; color:#f0f0f0; }
.file-path { color:#666; }
.toolbar { display:flex; align-items:center; gap:2px; background:#1a1a1a; border-radius:8px; padding:4px; }
.tool-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:transparent; border:none; color:#888; border-radius:6px; cursor:pointer; font-size:13px; transition:all .12s; }
.tool-btn:hover { background:#383838; color:#f0f0f0; }
.tool-btn.active { background:#7c5cfc; color:white; }
.tool-sep { width:1px; height:20px; background:#383838; margin:0 2px; }
.play-btn { display:flex; align-items:center; gap:6px; padding:0 12px; height:32px; background:transparent; border:1px solid #383838; border-radius:6px; color:#aaa; font-size:12px; font-weight:500; cursor:pointer; font-family:inherit; transition:all .12s; }
.play-btn:hover { border-color:#555; color:#f0f0f0; }
.play-btn.play-active { background:#14532d; color:#4ade80; border-color:#166534; }
.zoom-chip { font-size:12px; color:#888; font-variant-numeric:tabular-nums; }
</style>

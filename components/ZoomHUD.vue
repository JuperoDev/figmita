<script setup>
const { zoomLabel, zoomIn, zoomOut, fitToView } = useCanvas()
</script>

<template>
  <div class="zoom-hud">
    <button class="zhud-btn" @click="zoomOut"><i class="pi pi-minus" /></button>
    <span class="zhud-label" @click="fitToView">{{ zoomLabel }}</span>
    <button class="zhud-btn" @click="zoomIn"><i class="pi pi-plus" /></button>
  </div>
</template>

<style scoped>
.zoom-hud { position:absolute; bottom:20px; right:20px; display:flex; align-items:center; gap:2px; background:#2c2c2c; border:1px solid #3a3a3a; border-radius:8px; padding:3px; z-index:20; }
.zhud-btn { width:28px; height:28px; display:flex; align-items:center; justify-content:center; background:transparent; border:none; color:#888; border-radius:5px; cursor:pointer; font-size:11px; }
.zhud-btn:hover { background:#383838; color:#f0f0f0; }
.zhud-label { font-size:12px; color:#ccc; padding:0 8px; min-width:44px; text-align:center; cursor:pointer; font-variant-numeric:tabular-nums; }
.zhud-label:hover { color:#fff; }
</style>

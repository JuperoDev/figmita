<script setup>
import { nextTick } from 'vue'

const { screens, addScreen } = useScreens()
const { clearSelection } = useElements()
const { panToIdx } = useCanvas()

function handleAddScreen() {
  const idx = addScreen()
  clearSelection()
  nextTick(() => panToIdx(idx))
}
</script>

<template>
  <aside class="side-panel left-panel">
    <div class="panel-tabs">
      <button class="ptab active">Layers</button>
      <button class="ptab">Assets</button>
    </div>

    <div class="layers-scroll">
      <LayerScreenGroup
        v-for="(sc, i) in screens"
        :key="sc.id"
        :sc="sc"
        :idx="i"
        :is-last="i === screens.length - 1"
      />
      <button class="add-screen-btn" @click="handleAddScreen">
        <i class="pi pi-plus" /> Add screen
      </button>
    </div>
  </aside>
</template>

<style scoped>
.side-panel { width:240px; background:#252525; display:flex; flex-direction:column; flex-shrink:0; }
.left-panel  { border-right:1px solid #333; }
.panel-tabs { display:flex; border-bottom:1px solid #333; flex-shrink:0; }
.ptab { flex:1; padding:8px 0; background:transparent; border:none; color:#777; cursor:pointer; font-size:12px; border-bottom:2px solid transparent; margin-bottom:-1px; }
.ptab.active { color:#f0f0f0; border-bottom-color:#7c5cfc; }
.layers-scroll { flex:1; overflow-y:auto; padding:6px 0 0; }
.add-screen-btn { display:flex; align-items:center; gap:6px; width:calc(100% - 8px); margin:8px 4px; padding:7px 10px; background:#1e1e1e; border:1px dashed #3a3a3a; border-radius:6px; color:#666; font-size:12px; cursor:pointer; font-family:inherit; transition:all .15s; }
.add-screen-btn:hover { border-color:#7c5cfc; color:#a78bfa; background:#1a1a2e; }
</style>

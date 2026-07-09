<script setup>
const { zoomLabel, isHandTool, isDrawTool, drawTool, setDrawTool } = useCanvas()
const { playMode, startPlay } = usePlayMode()
const { copyLink } = useShare()

function toggleHand() { isHandTool.value = !isHandTool.value; drawTool.value = null }

const DRAW_TOOLS = [
  { kind: 'box',     icon: 'pi pi-stop',          title: 'Draw box (R)' },
  { kind: 'ellipse', icon: 'pi pi-circle',        title: 'Draw ellipse (O)' },
  { kind: 'polygon', icon: 'pi pi-star',          title: 'Draw polygon (Y)' },
  { kind: 'pencil',  icon: 'pi pi-pencil',        title: 'Pencil — freehand (B)' },
  { kind: 'pen',     icon: 'pi pi-pen-to-square', title: 'Pen — smoothed freehand (Shift+B)' },
]
</script>

<template>
  <header class="top-bar">
    <div class="top-left">
      <div class="app-logo">F</div>
      <span class="file-name">figmita</span>
      <span class="file-path">/ Designs</span>
    </div>

    <div class="toolbar">
      <button
        class="tool-btn" :class="{ active: !playMode && !isHandTool && !isDrawTool }"
        title="Select (Esc)"
        @click="playMode = false; isHandTool = false; drawTool = null"
      >
        <i class="pi pi-arrows-alt" />
      </button>
      <button class="tool-btn" :class="{ active: isHandTool }" title="Hand tool (H)" @click="toggleHand">
        <i class="pi pi-hand" />
      </button>
      <div class="tool-sep" />
      <button
        v-for="t in DRAW_TOOLS" :key="t.kind"
        class="tool-btn" :class="{ active: drawTool === t.kind }"
        :title="t.title" @click="setDrawTool(t.kind)"
      >
        <i :class="t.icon" />
      </button>
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
      <NuxtLink to="/catalog" class="catalog-link" title="PrimeVue component catalog">
        <i class="pi pi-objects-column" /> Catalog
      </NuxtLink>
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
.catalog-link { display:flex; align-items:center; gap:6px; padding:0 10px; height:30px; border:1px solid #383838; border-radius:6px; color:#aaa; font-size:12px; text-decoration:none; transition:all .12s; }
.catalog-link:hover { border-color:#555; color:#f0f0f0; }
.catalog-link .pi { font-size:12px; }
</style>

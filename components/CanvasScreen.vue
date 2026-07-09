<script setup>
import { computed } from 'vue'
import { SCREEN_W, SCREEN_H } from '~/composables/useConstants.js'

const props = defineProps({
  sc:  { type: Object, required: true },
  idx: { type: Number, required: true },
})

const { screens, activeScreenId, startScreenId } = useScreens()
const { selectedEl, clearSelection } = useElements()
const { screenLeft, onResizeHandleMouseDown, zoom, drawRect, onScreenDrawStart } = useCanvas()
const { playMode } = usePlayMode()

const SCREEN_SHADOWS = {
  none:    null,
  soft:    '0 12px 40px rgba(0,0,0,.35)',
  default: '0 24px 80px rgba(0,0,0,.6)',
  strong:  '0 48px 140px rgba(0,0,0,.9)',
}

const frameHeight = computed(() => props.sc.height ?? SCREEN_H)
const isExpanded   = computed(() => frameHeight.value > SCREEN_H)

// Borders/outlines live inside the canvas's scale(zoom) transform, so a
// fixed px width would visually shrink when zoomed out. Dividing by zoom
// keeps these lines a constant thickness on screen at any zoom level.
const px = (n) => `${n / zoom.value}px`

const frameShadow = computed(() => {
  const rings = []
  // Screen's own design border: an inset ring so element coordinates
  // don't shift with the border width (scales with zoom, so raw px)
  const b = props.sc.border
  if (b?.width > 0) rings.push(`inset 0 0 0 ${b.width}px ${b.color}`)
  if (activeScreenId.value === props.sc.id)
    rings.push(selectedEl.value ? `0 0 0 ${px(1)} #4a3f8a` : `0 0 0 ${px(2)} #7c5cfc`)
  else
    rings.push(`0 0 0 ${px(1)} rgba(255,255,255,.06)`)
  if (props.sc.id === startScreenId.value) rings.push(`0 0 0 ${px(4)} #4ade80`)
  const drop = SCREEN_SHADOWS[props.sc.shadow ?? 'default']
  if (drop) rings.push(drop)
  return rings.join(', ')
})

const gridStyle = computed(() => {
  const g = props.sc.grid
  if (!g?.visible) return null
  return {
    padding: `0 ${g.margin}px`,
    gap:     `${g.gutter}px`,
  }
})

function onScreenMouseDown(e) {
  if (onScreenDrawStart(e, props.sc.id, props.idx)) return
  setActiveScreen(props.sc.id)
}

const viewportGuideStyle = computed(() => ({
  width:       SCREEN_W + 'px',
  height:      SCREEN_H + 'px',
  borderWidth: px(2),
}))

function setActiveScreen(id) {
  activeScreenId.value = id
  clearSelection()
}
</script>

<template>
  <div
    class="frame-wrapper"
    :style="{ position: 'absolute', left: screenLeft(idx) + 'px', top: '0' }"
  >
    <span class="frame-label" :class="{ 'label-active': activeScreenId === sc.id }">
      {{ sc.name }}
      <span v-if="sc.id === startScreenId" class="frame-start-tag">▶ entry</span>
    </span>

    <div
      class="screen-frame"
      :style="{ width: SCREEN_W + 'px', height: frameHeight + 'px', background: sc.bg, boxShadow: frameShadow }"
      @mousedown.stop="onScreenMouseDown"
    >
      <div v-if="sc.elements.length === 0 && !playMode" class="empty-hint">
        <i class="pi pi-layout" />
        <span>Empty screen</span>
      </div>

      <CanvasElement
        v-for="el in sc.elements"
        :key="el.id"
        :sc="sc"
        :el="el"
      />

      <div v-if="isExpanded" class="viewport-guide" :style="viewportGuideStyle">
        <span class="viewport-guide-label">Visible area — scrolls below ↓</span>
      </div>

      <!-- Layout grid overlay (columns), like a Figma layout grid -->
      <div v-if="gridStyle && !playMode" class="layout-grid" :style="gridStyle">
        <div
          v-for="n in sc.grid.cols" :key="n"
          class="layout-col"
          :style="{ background: sc.grid.color + '22', borderLeft: `1px solid ${sc.grid.color}44`, borderRight: `1px solid ${sc.grid.color}44` }"
        />
      </div>

      <!-- Rubber-band preview while drawing a box -->
      <div
        v-if="drawRect && drawRect.scId === sc.id"
        class="draw-preview"
        :style="{ left: drawRect.x + 'px', top: drawRect.y + 'px', width: drawRect.w + 'px', height: drawRect.h + 'px' }"
      />
    </div>

    <div
      class="resize-handle"
      :style="{ top: frameHeight + 'px', width: SCREEN_W + 'px' }"
      @mousedown.stop="onResizeHandleMouseDown($event, sc.id)"
    >
      <div class="resize-grip" />
    </div>
  </div>
</template>

<style scoped>
.frame-wrapper { display:inline-block; }
.frame-label { position:absolute; top:-24px; left:0; font-size:11px; color:#555; white-space:nowrap; pointer-events:none; transition:color .15s; }
.frame-label.label-active { color:#a78bfa; }
.screen-frame { position:relative; overflow:hidden; }
.frame-start-tag { display:inline-flex; align-items:center; margin-left:6px; font-size:9px; font-weight:600; letter-spacing:.04em; color:#4ade80; opacity:.8; }
.empty-hint { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; gap:10px; padding:28px 40px; color:#6b7280; font-size:14px; pointer-events:none; }
.empty-hint i { font-size:2rem; opacity:.4; }
.viewport-guide { position:absolute; top:0; left:0; box-sizing:border-box; border-style:dashed; border-color:rgba(124,92,252,.6); pointer-events:none; }
.viewport-guide-label { position:absolute; bottom:6px; left:8px; font-size:10px; font-weight:600; color:#a78bfa; background:rgba(20,20,20,.7); padding:2px 6px; border-radius:4px; }
.resize-handle { position:absolute; left:0; height:14px; margin-top:-7px; cursor:ns-resize; display:flex; align-items:center; justify-content:center; }
.resize-grip { width:48px; height:5px; border-radius:3px; background:#3a3a3a; transition:background .15s; }
.resize-handle:hover .resize-grip { background:#7c5cfc; }
.layout-grid { position:absolute; inset:0; display:flex; pointer-events:none; z-index:40; }
.layout-col { flex:1; height:100%; box-sizing:border-box; }
.draw-preview { position:absolute; background:rgba(124,92,252,.15); border:1px solid #7c5cfc; box-sizing:border-box; pointer-events:none; z-index:60; }
</style>

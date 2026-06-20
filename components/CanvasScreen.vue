<script setup>
import { computed } from 'vue'
import { SCREEN_W, SCREEN_H } from '~/composables/useConstants.js'

const props = defineProps({
  sc:  { type: Object, required: true },
  idx: { type: Number, required: true },
})

const { screens, activeScreenId, startScreenId } = useScreens()
const { selectedEl, addElement, clearSelection } = useElements()
const { screenLeft, onResizeHandleMouseDown, zoom } = useCanvas()
const { playMode } = usePlayMode()

const frameHeight = computed(() => props.sc.height ?? SCREEN_H)
const isExpanded   = computed(() => frameHeight.value > SCREEN_H)

// Borders/outlines live inside the canvas's scale(zoom) transform, so a
// fixed px width would visually shrink when zoomed out. Dividing by zoom
// keeps these lines a constant thickness on screen at any zoom level.
const px = (n) => `${n / zoom.value}px`

const frameShadow = computed(() => {
  const rings = []
  if (activeScreenId.value === props.sc.id)
    rings.push(selectedEl.value ? `0 0 0 ${px(1)} #4a3f8a` : `0 0 0 ${px(2)} #7c5cfc`)
  else
    rings.push(`0 0 0 ${px(1)} rgba(255,255,255,.06)`)
  if (props.sc.id === startScreenId.value) rings.push(`0 0 0 ${px(4)} #4ade80`)
  rings.push('0 24px 80px rgba(0,0,0,.6)')
  return rings.join(', ')
})

const viewportGuideStyle = computed(() => ({
  width:       SCREEN_W + 'px',
  height:      SCREEN_H + 'px',
  borderWidth: px(2),
}))

function setActiveScreen(id) {
  activeScreenId.value = id
  clearSelection()
}

function handleEmptyClick() {
  activeScreenId.value = props.sc.id
  addElement('card')
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
      @mousedown.stop="setActiveScreen(sc.id)"
    >
      <div
        v-if="sc.elements.length === 0 && !playMode"
        class="empty-hint"
        @click.stop="handleEmptyClick"
      >
        <i class="pi pi-plus-circle" />
        <span>Click to add a card</span>
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
.empty-hint { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; gap:10px; padding:28px 40px; border:2px dashed #d1d5db; border-radius:16px; color:#9ca3af; cursor:pointer; font-size:14px; transition:all .15s; pointer-events:all; }
.empty-hint:hover { border-color:#7c5cfc; color:#7c5cfc; background:rgba(124,92,252,.04); }
.empty-hint i { font-size:2rem; }
.viewport-guide { position:absolute; top:0; left:0; box-sizing:border-box; border-style:dashed; border-color:rgba(124,92,252,.6); pointer-events:none; }
.viewport-guide-label { position:absolute; bottom:6px; left:8px; font-size:10px; font-weight:600; color:#a78bfa; background:rgba(20,20,20,.7); padding:2px 6px; border-radius:4px; }
.resize-handle { position:absolute; left:0; height:14px; margin-top:-7px; cursor:ns-resize; display:flex; align-items:center; justify-content:center; }
.resize-grip { width:48px; height:5px; border-radius:3px; background:#3a3a3a; transition:background .15s; }
.resize-handle:hover .resize-grip { background:#7c5cfc; }
</style>

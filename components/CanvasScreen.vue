<script setup>
import { nextTick } from 'vue'
import { SCREEN_W, SCREEN_H } from '~/composables/useConstants.js'

const props = defineProps({
  sc:  { type: Object, required: true },
  idx: { type: Number, required: true },
})

const { screens, activeScreenId, startScreenId } = useScreens()
const { selectedEl, addElement, clearSelection } = useElements()
const { panToIdx, screenLeft } = useCanvas()
const { playMode } = usePlayMode()

function setActiveScreen(id) {
  activeScreenId.value = id
  clearSelection()
  nextTick(() => panToIdx(props.idx))
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
      :class="{
        'frame-active':   activeScreenId === sc.id && !selectedEl,
        'frame-has-sel':  activeScreenId === sc.id && !!selectedEl,
      }"
      :style="{ width: SCREEN_W + 'px', height: SCREEN_H + 'px', background: sc.bg }"
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
    </div>
  </div>
</template>

<style scoped>
.frame-wrapper { display:inline-block; }
.frame-label { position:absolute; top:-24px; left:0; font-size:11px; color:#555; white-space:nowrap; pointer-events:none; transition:color .15s; }
.frame-label.label-active { color:#a78bfa; }
.screen-frame { position:relative; overflow:hidden; box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 24px 80px rgba(0,0,0,.6); }
.frame-active  { box-shadow:0 0 0 2px #7c5cfc, 0 24px 80px rgba(0,0,0,.6); }
.frame-has-sel { box-shadow:0 0 0 1px #4a3f8a, 0 24px 80px rgba(0,0,0,.6); }
.frame-start-tag { display:inline-flex; align-items:center; margin-left:6px; font-size:9px; font-weight:600; letter-spacing:.04em; color:#4ade80; opacity:.8; }
.empty-hint { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; gap:10px; padding:28px 40px; border:2px dashed #d1d5db; border-radius:16px; color:#9ca3af; cursor:pointer; font-size:14px; transition:all .15s; pointer-events:all; }
.empty-hint:hover { border-color:#7c5cfc; color:#7c5cfc; background:rgba(124,92,252,.04); }
.empty-hint i { font-size:2rem; }
</style>

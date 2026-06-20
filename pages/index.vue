<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'

const { onMouseMove, onMouseUp, fitToView } = useCanvas()
const { playMode, computePlayScale } = usePlayMode()
const { setupKeyboard, teardownKeyboard } = useKeyboard()
const { screens, activeScreenId, startScreenId } = useScreens()
const { playScreenId } = usePlayMode()

onMounted(() => {
  setupKeyboard()
  window.addEventListener('resize', computePlayScale)
  nextTick(() => fitToView())

  try {
    const enc = new URLSearchParams(window.location.search).get('proto')
    if (enc) {
      const d = JSON.parse(decodeURIComponent(escape(atob(enc))))
      if (d.screens?.length) {
        screens.value        = d.screens
        activeScreenId.value = d.screens[0].id
        startScreenId.value  = d.startScreenId ?? d.screens[0].id
        playScreenId.value   = startScreenId.value
        nextTick(() => fitToView())
      }
    }
  } catch {}
})

onUnmounted(() => {
  teardownKeyboard()
  window.removeEventListener('resize', computePlayScale)
})
</script>

<template>
  <div class="shell" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp">
    <AppTopBar />
    <div class="main-body">
      <AppLeftPanel />
      <AppCanvas />
      <AppRightPanel />
    </div>
    <AppPlayOverlay />
    <AppToast />
  </div>
</template>

<style scoped>
.shell {
  display:flex; flex-direction:column; height:100vh; width:100vw;
  background:#1e1e1e; color:#e0e0e0;
  font-family:'Inter',system-ui,sans-serif; font-size:13px;
  user-select:none; overflow:hidden;
}
.main-body { display:flex; flex:1; overflow:hidden; }
</style>

<script setup>
const { canvasRef, transformStyle, cursorClass, handleWheel, onCanvasMouseDown } = useCanvas()
const { screens } = useScreens()
</script>

<template>
  <main
    ref="canvasRef"
    class="canvas-area"
    :class="cursorClass"
    @wheel.prevent="handleWheel"
    @mousedown="onCanvasMouseDown"
  >
    <div :style="transformStyle">
      <CanvasArrows />
      <CanvasScreen
        v-for="(sc, i) in screens"
        :key="sc.id"
        :sc="sc"
        :idx="i"
      />
    </div>

    <ZoomHUD />
  </main>
</template>

<style scoped>
.canvas-area { flex:1; overflow:hidden; position:relative; background-color:#1a1a1a; background-image:radial-gradient(circle,#2e2e2e 1.5px,transparent 1.5px); background-size:24px 24px; }
.cursor-grab      { cursor:grab !important; }
.cursor-grabbing  { cursor:grabbing !important; }
.cursor-ns-resize { cursor:ns-resize !important; }
.cursor-crosshair { cursor:crosshair !important; }
.cursor-crosshair :deep(.el-anchor) { cursor:crosshair !important; }
</style>

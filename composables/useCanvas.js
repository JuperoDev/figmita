import { ref, computed } from 'vue'
import { SCREEN_W, SCREEN_H, SCREEN_GAP } from './useConstants.js'
import { useScreens } from './useScreens.js'
import { useElements } from './useElements.js'

const canvasRef    = ref(null)
const zoom         = ref(1)
const panX         = ref(0)
const panY         = ref(0)
const isPanning    = ref(false)
const isSpaceDown  = ref(false)
const isHandTool   = ref(false)
const lastMouse    = ref({ x: 0, y: 0 })
const isDraggingEl = ref(false)
const dragScId     = ref(null)
const dragElId     = ref(null)
const dragStart    = ref({ x: 0, y: 0, ox: 0, oy: 0 })
const isResizingScreen = ref(false)
const resizeScId        = ref(null)
const resizeStart       = ref({ y: 0, oh: 0 })

export function useCanvas() {
  const { screens, activeScreenId } = useScreens()
  const { selectedEl, selectedSub } = useElements()

  const totalCanvasW = computed(() =>
    screens.value.length * SCREEN_W + (screens.value.length - 1) * SCREEN_GAP
  )

  const transformStyle = computed(() => ({
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
    transformOrigin: '0 0',
    willChange: 'transform',
    position: 'absolute',
    top: '0', left: '0',
  }))

  const zoomLabel   = computed(() => `${Math.round(zoom.value * 100)}%`)
  const cursorClass = computed(() =>
    isResizingScreen.value ? 'cursor-ns-resize' :
    isPanning.value ? 'cursor-grabbing' : (isSpaceDown.value || isHandTool.value) ? 'cursor-grab' : ''
  )

  const arrows = computed(() => {
    const result = []
    screens.value.forEach((sc, si) => {
      sc.elements.forEach(el => {
        const ia = el.interaction
        if (!ia || ia.action === 'alert' || !ia.navigateTo) return
        const ti = screens.value.findIndex(s => s.id === ia.navigateTo)
        if (ti < 0) return
        const x1 = screenLeft(si) + SCREEN_W
        const y1 = el.pos.y + 460
        const x2 = screenLeft(ti)
        const y2 = screens.value[ti].elements[0]?.pos.y + 460 ?? SCREEN_H / 2
        const mx = (x1 + x2) / 2
        result.push({ id: el.id, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}` })
      })
    })
    return result
  })

  function screenLeft(i) { return i * (SCREEN_W + SCREEN_GAP) }

  function applyZoom(nz, px, py) {
    nz = Math.min(Math.max(nz, 0.05), 8)
    const r = nz / zoom.value
    panX.value = px - (px - panX.value) * r
    panY.value = py - (py - panY.value) * r
    zoom.value = nz
  }

  function handleWheel(e) {
    const rect = canvasRef.value.getBoundingClientRect()
    applyZoom(zoom.value * (e.deltaY < 0 ? 1.1 : 0.9), e.clientX - rect.left, e.clientY - rect.top)
  }

  function zoomIn() {
    if (canvasRef.value)
      applyZoom(zoom.value * 1.25, canvasRef.value.clientWidth / 2, canvasRef.value.clientHeight / 2)
  }

  function zoomOut() {
    if (canvasRef.value)
      applyZoom(zoom.value / 1.25, canvasRef.value.clientWidth / 2, canvasRef.value.clientHeight / 2)
  }

  function fitToView() {
    if (!canvasRef.value) return
    const pad = 80
    const z = Math.min(
      (canvasRef.value.clientWidth  - pad * 2) / totalCanvasW.value,
      (canvasRef.value.clientHeight - pad * 2) / SCREEN_H,
    )
    zoom.value = z
    panX.value = (canvasRef.value.clientWidth  - totalCanvasW.value * z) / 2
    panY.value = (canvasRef.value.clientHeight - SCREEN_H * z) / 2
  }

  function panToIdx(i) {
    if (!canvasRef.value) return
    const sx = screenLeft(i)
    panX.value = canvasRef.value.clientWidth  / 2 - (sx + SCREEN_W / 2) * zoom.value
    panY.value = canvasRef.value.clientHeight / 2 - (SCREEN_H / 2) * zoom.value
  }

  function onCanvasMouseDown(e) {
    if (e.button === 1 || (e.button === 0 && (isSpaceDown.value || isHandTool.value))) {
      isPanning.value = true
      lastMouse.value = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    } else if (e.button === 0) {
      selectedEl.value  = null
      selectedSub.value = null
    }
  }

  function onElMouseDown(e, scId, elId) {
    if (e.button !== 0 || isSpaceDown.value || isHandTool.value) return
    const sc = screens.value.find(s => s.id === scId)
    const el = sc?.elements.find(el => el.id === elId)
    if (!el) return
    activeScreenId.value = scId
    selectedEl.value     = { screenId: scId, elId }
    selectedSub.value    = null
    isDraggingEl.value   = true
    dragScId.value       = scId
    dragElId.value       = elId
    dragStart.value      = { x: e.clientX, y: e.clientY, ox: el.pos.x, oy: el.pos.y }
    e.stopPropagation()
    e.preventDefault()
  }

  function onResizeHandleMouseDown(e, scId) {
    if (e.button !== 0) return
    const sc = screens.value.find(s => s.id === scId)
    if (!sc) return
    isResizingScreen.value = true
    resizeScId.value       = scId
    resizeStart.value      = { y: e.clientY, oh: sc.height ?? SCREEN_H }
    e.stopPropagation()
    e.preventDefault()
  }

  function onMouseMove(e) {
    if (isPanning.value) {
      panX.value += e.clientX - lastMouse.value.x
      panY.value += e.clientY - lastMouse.value.y
      lastMouse.value = { x: e.clientX, y: e.clientY }
    } else if (isDraggingEl.value) {
      const sc = screens.value.find(s => s.id === dragScId.value)
      const el = sc?.elements.find(e => e.id === dragElId.value)
      if (el) {
        el.pos.x = Math.round(dragStart.value.ox + (e.clientX - dragStart.value.x) / zoom.value)
        el.pos.y = Math.round(dragStart.value.oy + (e.clientY - dragStart.value.y) / zoom.value)
      }
    } else if (isResizingScreen.value) {
      const sc = screens.value.find(s => s.id === resizeScId.value)
      if (sc) {
        const dy = (e.clientY - resizeStart.value.y) / zoom.value
        sc.height = Math.max(SCREEN_H, Math.round(resizeStart.value.oh + dy))
      }
    }
  }

  function onMouseUp() { isPanning.value = false; isDraggingEl.value = false; isResizingScreen.value = false }

  return {
    canvasRef, zoom, panX, panY, isPanning, isSpaceDown, isHandTool,
    isDraggingEl, dragElId,
    totalCanvasW, transformStyle, zoomLabel, cursorClass, arrows,
    screenLeft, handleWheel, zoomIn, zoomOut, fitToView, panToIdx,
    onCanvasMouseDown, onElMouseDown, onMouseMove, onMouseUp,
    isResizingScreen, onResizeHandleMouseDown,
  }
}

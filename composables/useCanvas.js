import { ref, computed } from 'vue'
import { SCREEN_W, SCREEN_H, SCREEN_GAP } from './useConstants.js'
import { useScreens } from './useScreens.js'
import { useElements } from './useElements.js'
import { makeElement } from './useFactories.js'
import { snapRectToGrid } from './useGridLayout.js'

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
const multiDragStarts = ref([]) // [{ elId, ox, oy }] when dragging a multi-selection
const isResizingScreen = ref(false)
const resizeScId        = ref(null)
const resizeStart       = ref({ y: 0, oh: 0 })
const isDrawTool   = ref(false)
const drawing      = ref(null) // { scId, x0, y0, x1, y1 }
const isResizingEl = ref(false)
const elResize     = ref(null) // { scId, elId, edges, x, y, ox, oy, ow, oh }

export function useCanvas() {
  const { screens, activeScreenId } = useScreens()
  const { selectedEl, selectedSub, multiSel, toggleMulti, isMultiSel } = useElements()

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
    isDrawTool.value ? 'cursor-crosshair' :
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

  // Converts a mouse event to coordinates local to screen `idx`
  function toScreenCoords(e, idx) {
    const rect = canvasRef.value.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - panX.value) / zoom.value - screenLeft(idx),
      y: (e.clientY - rect.top  - panY.value) / zoom.value,
    }
  }

  // Draw tool: mousedown on a screen starts a rubber-band box
  function onScreenDrawStart(e, scId, idx) {
    if (!isDrawTool.value || e.button !== 0) return false
    const { x, y } = toScreenCoords(e, idx)
    activeScreenId.value = scId
    drawing.value = { scId, x0: x, y0: y, x1: x, y1: y }
    e.stopPropagation()
    e.preventDefault()
    return true
  }

  const drawRect = computed(() => {
    if (!drawing.value) return null
    const d = drawing.value
    return {
      scId: d.scId,
      x: Math.round(Math.min(d.x0, d.x1)),
      y: Math.round(Math.min(d.y0, d.y1)),
      w: Math.round(Math.abs(d.x1 - d.x0)),
      h: Math.round(Math.abs(d.y1 - d.y0)),
    }
  })

  function commitDrawing() {
    let r = drawRect.value
    drawing.value = null
    if (!r) return
    const sc = screens.value.find(s => s.id === r.scId)
    if (!sc) return
    // With a visible layout grid, drawn boxes snap to the covered cells —
    // even a click-sized drag fills its cell (cssgridgenerator-style)
    if (sc.grid?.visible && Array.isArray(sc.grid.cols)) r = snapRectToGrid(sc, r)
    if (r.w < 8 || r.h < 8) return
    const el = makeElement('box')
    el.name = `Box ${screens.value.flatMap(s => s.elements).filter(e => e.type === 'box').length + 1}`
    el.pos = { x: r.x, y: r.y }
    el.config.w = r.w
    el.config.h = r.h
    sc.elements.push(el)
    selectedEl.value = { screenId: sc.id, elId: el.id }
    isDrawTool.value = false
  }

  // Resizable elements (boxes): drag any handle; `edges` is e.g. 'br', 'tm'
  function onElResizeMouseDown(e, scId, elId, edges) {
    if (e.button !== 0) return
    const sc = screens.value.find(s => s.id === scId)
    const el = sc?.elements.find(el => el.id === elId)
    if (!el) return
    isResizingEl.value = true
    elResize.value = {
      scId, elId, edges,
      x: e.clientX, y: e.clientY,
      ox: el.pos.x, oy: el.pos.y, ow: el.config.w, oh: el.config.h,
    }
    e.stopPropagation()
    e.preventDefault()
  }

  function onElMouseDown(e, scId, elId) {
    if (isDrawTool.value) return // let the event bubble to the screen so drawing works over elements
    if (e.button !== 0 || isSpaceDown.value || isHandTool.value) return
    const sc = screens.value.find(s => s.id === scId)
    const el = sc?.elements.find(el => el.id === elId)
    if (!el) return
    // Shift-click builds a multi-selection instead of dragging
    if (e.shiftKey) {
      toggleMulti(scId, elId)
      e.stopPropagation()
      e.preventDefault()
      return
    }
    activeScreenId.value = scId
    // Dragging a member of the multi-selection moves the whole selection
    if (isMultiSel(scId, elId)) {
      multiDragStarts.value = multiSel.value.ids
        .map(id => sc.elements.find(el => el.id === id))
        .filter(Boolean)
        .map(el => ({ elId: el.id, ox: el.pos.x, oy: el.pos.y }))
    } else {
      multiSel.value = { screenId: null, ids: [] }
      multiDragStarts.value = []
    }
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
      const dx = (e.clientX - dragStart.value.x) / zoom.value
      const dy = (e.clientY - dragStart.value.y) / zoom.value
      if (multiDragStarts.value.length) {
        for (const start of multiDragStarts.value) {
          const el = sc?.elements.find(e => e.id === start.elId)
          if (el) {
            el.pos.x = Math.round(start.ox + dx)
            el.pos.y = Math.round(start.oy + dy)
          }
        }
      } else {
        const el = sc?.elements.find(e => e.id === dragElId.value)
        if (el) {
          el.pos.x = Math.round(dragStart.value.ox + dx)
          el.pos.y = Math.round(dragStart.value.oy + dy)
        }
      }
    } else if (isResizingScreen.value) {
      const sc = screens.value.find(s => s.id === resizeScId.value)
      if (sc) {
        const dy = (e.clientY - resizeStart.value.y) / zoom.value
        sc.height = Math.max(SCREEN_H, Math.round(resizeStart.value.oh + dy))
      }
    } else if (drawing.value) {
      const idx = screens.value.findIndex(s => s.id === drawing.value.scId)
      const { x, y } = toScreenCoords(e, idx)
      drawing.value.x1 = x
      drawing.value.y1 = y
    } else if (isResizingEl.value && elResize.value) {
      const r = elResize.value
      const sc = screens.value.find(s => s.id === r.scId)
      const el = sc?.elements.find(e => e.id === r.elId)
      if (el) {
        const dx = (e.clientX - r.x) / zoom.value
        const dy = (e.clientY - r.y) / zoom.value
        const MIN = 8
        if (r.edges.includes('l')) {
          const w = Math.max(MIN, Math.round(r.ow - dx))
          el.pos.x = Math.round(r.ox + r.ow - w)
          el.config.w = w
        }
        if (r.edges.includes('r')) el.config.w = Math.max(MIN, Math.round(r.ow + dx))
        if (r.edges.includes('t')) {
          const h = Math.max(MIN, Math.round(r.oh - dy))
          el.pos.y = Math.round(r.oy + r.oh - h)
          el.config.h = h
        }
        if (r.edges.includes('b')) el.config.h = Math.max(MIN, Math.round(r.oh + dy))
      }
    }
  }

  function onMouseUp() {
    if (drawing.value) commitDrawing()
    isPanning.value = false
    isDraggingEl.value = false
    isResizingScreen.value = false
    isResizingEl.value = false
    elResize.value = null
    multiDragStarts.value = []
  }

  return {
    canvasRef, zoom, panX, panY, isPanning, isSpaceDown, isHandTool,
    isDraggingEl, dragElId,
    totalCanvasW, transformStyle, zoomLabel, cursorClass, arrows,
    screenLeft, handleWheel, zoomIn, zoomOut, fitToView, panToIdx,
    onCanvasMouseDown, onElMouseDown, onMouseMove, onMouseUp,
    isResizingScreen, onResizeHandleMouseDown,
    isDrawTool, drawRect, onScreenDrawStart, onElResizeMouseDown,
  }
}

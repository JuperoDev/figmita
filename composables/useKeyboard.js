import { useElements } from './useElements.js'
import { usePlayMode } from './usePlayMode.js'
import { useCanvas } from './useCanvas.js'

const PAN_STEP = 80

export function useKeyboard() {
  const { selectedEl, selectedSub, deleteEl } = useElements()
  const { playMode, fakeAlert, startPlay, closeAlert } = usePlayMode()
  const { isSpaceDown, isHandTool, isDrawTool, panX, panY, zoomIn, zoomOut } = useCanvas()

  function onKeyDown(e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
    if (e.code === 'Space') { isSpaceDown.value = true; e.preventDefault() }
    if (e.code === 'KeyH')  { isHandTool.value = !isHandTool.value; isDrawTool.value = false }
    if (e.code === 'KeyR')  { isDrawTool.value = !isDrawTool.value; isHandTool.value = false }
    if (e.code === 'KeyP')  { playMode.value ? (playMode.value = false) : startPlay() }
    if (e.code === 'Escape') {
      if (fakeAlert.value.visible) closeAlert()
      else if (playMode.value) playMode.value = false
      else if (isDrawTool.value) isDrawTool.value = false
      else if (isHandTool.value) isHandTool.value = false
    }
    if ((e.code === 'Delete' || e.code === 'Backspace') && selectedEl.value && !selectedSub.value)
      deleteEl(selectedEl.value.screenId, selectedEl.value.elId)

    if (playMode.value || e.ctrlKey || e.metaKey) return

    if (e.code === 'ArrowUp')    { panY.value += PAN_STEP; e.preventDefault() }
    if (e.code === 'ArrowDown')  { panY.value -= PAN_STEP; e.preventDefault() }
    if (e.code === 'ArrowLeft')  { panX.value += PAN_STEP; e.preventDefault() }
    if (e.code === 'ArrowRight') { panX.value -= PAN_STEP; e.preventDefault() }
    if (e.code === 'Equal' || e.code === 'NumpadAdd')      { zoomIn();  e.preventDefault() }
    if (e.code === 'Minus' || e.code === 'NumpadSubtract') { zoomOut(); e.preventDefault() }
  }

  function onKeyUp(e) { if (e.code === 'Space') isSpaceDown.value = false }

  function setupKeyboard() {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  }

  function teardownKeyboard() {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  }

  return { setupKeyboard, teardownKeyboard }
}

import { useElements } from './useElements.js'
import { usePlayMode } from './usePlayMode.js'
import { useCanvas } from './useCanvas.js'

export function useKeyboard() {
  const { selectedEl, selectedSub, deleteEl } = useElements()
  const { playMode, fakeAlert, startPlay, closeAlert } = usePlayMode()
  const { isSpaceDown } = useCanvas()

  function onKeyDown(e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
    if (e.code === 'Space') { isSpaceDown.value = true; e.preventDefault() }
    if (e.code === 'KeyP')  { playMode.value ? (playMode.value = false) : startPlay() }
    if (e.code === 'Escape') {
      if (fakeAlert.value.visible) closeAlert()
      else if (playMode.value) playMode.value = false
    }
    if ((e.code === 'Delete' || e.code === 'Backspace') && selectedEl.value && !selectedSub.value)
      deleteEl(selectedEl.value.screenId, selectedEl.value.elId)
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

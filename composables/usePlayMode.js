import { ref, computed } from 'vue'
import { SCREEN_W, SCREEN_H } from './useConstants.js'
import { useScreens } from './useScreens.js'
import { useElements } from './useElements.js'

const playMode      = ref(false)
const playScreenId  = ref(null)
const transitionDir = ref('left')
const fakeAlert     = ref({ visible: false, text: '' })
const pendingNav    = ref(null)
const playScale     = ref(0.6)

export function usePlayMode() {
  const { screens, startScreenId } = useScreens()
  const { selectedEl, selectedSub } = useElements()

  const playScreen = computed(() =>
    screens.value.find(s => s.id === playScreenId.value) ?? screens.value[0]
  )

  function computePlayScale() {
    if (typeof window === 'undefined') return
    playScale.value = Math.min(
      (window.innerWidth  - 48) / SCREEN_W,
      (window.innerHeight - 72) / SCREEN_H,
    )
  }

  function startPlay() {
    playScreenId.value = startScreenId.value
    fakeAlert.value    = { visible: false, text: '' }
    pendingNav.value   = null
    selectedEl.value   = null
    selectedSub.value  = null
    computePlayScale()
    playMode.value = true
  }

  function goTo(targetId) {
    const ci = screens.value.findIndex(s => s.id === playScreenId.value)
    const ti = screens.value.findIndex(s => s.id === targetId)
    if (ti < 0 || ti === ci) return
    transitionDir.value = ti > ci ? 'left' : 'right'
    playScreenId.value  = targetId
  }

  function handlePlayBtn(el) {
    const ia = el.interaction
    if (!ia) return
    if (ia.action === 'alert') {
      fakeAlert.value = { visible: true, text: ia.alertText }
    } else if (ia.action === 'navigate') {
      if (ia.navigateTo) goTo(ia.navigateTo)
    } else if (ia.action === 'alert+navigate') {
      pendingNav.value = ia.navigateTo
      fakeAlert.value  = { visible: true, text: ia.alertText }
    }
  }

  function closeAlert() {
    fakeAlert.value.visible = false
    if (pendingNav.value) { goTo(pendingNav.value); pendingNav.value = null }
  }

  return {
    playMode, playScreenId, transitionDir, fakeAlert, playScale, playScreen,
    computePlayScale, startPlay, goTo, handlePlayBtn, closeAlert,
  }
}

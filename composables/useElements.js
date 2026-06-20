import { ref, computed } from 'vue'
import { useScreens } from './useScreens.js'
import { makeElement } from './useFactories.js'

const { screens, activeScreen, activeScreenId } = useScreens()

const selectedEl  = ref(null)
const selectedSub = ref(null)

const activeElement = computed(() => {
  if (!selectedEl.value) return null
  const sc = screens.value.find(s => s.id === selectedEl.value.screenId)
  return sc?.elements.find(e => e.id === selectedEl.value.elId) ?? null
})

export function useElements() {

  function isElSel(scId, elId) {
    return selectedEl.value?.screenId === scId && selectedEl.value?.elId === elId
  }

  function isSubSel(scId, elId) {
    return isElSel(scId, elId) && selectedSub.value === 'btn'
  }

  function clearSelection() {
    selectedEl.value  = null
    selectedSub.value = null
  }

  function clickEl(scId, elId) {
    activeScreenId.value = scId
    selectedEl.value     = { screenId: scId, elId }
    selectedSub.value    = null
  }

  function clickSub(scId, elId) {
    activeScreenId.value = scId
    selectedEl.value     = { screenId: scId, elId }
    selectedSub.value    = 'btn'
  }

  function addElement(type) {
    const sc = activeScreen.value
    if (!sc) return
    const el = makeElement(type)
    if (sc.elements.length > 0) {
      el.pos.x += sc.elements.length * 20
      el.pos.y += sc.elements.length * 20
    }
    sc.elements.push(el)
    selectedEl.value  = { screenId: sc.id, elId: el.id }
    selectedSub.value = null
  }

  function deleteEl(scId, elId) {
    const sc = screens.value.find(s => s.id === scId)
    if (!sc) return
    sc.elements = sc.elements.filter(e => e.id !== elId)
    if (isElSel(scId, elId)) clearSelection()
  }

  return {
    selectedEl, selectedSub, activeElement,
    isElSel, isSubSel, clearSelection,
    clickEl, clickSub, addElement, deleteEl,
  }
}

import { ref, computed } from 'vue'
import { useScreens } from './useScreens.js'
import { makeElement } from './useFactories.js'
import { useLibrary } from './useLibrary.js'

const { screens, activeScreen, activeScreenId } = useScreens()

const selectedEl  = ref(null)
const selectedSub = ref(null)
// Shift-click multi-selection (element ids on one screen), for grouping
const multiSel = ref({ screenId: null, ids: [] })

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
    multiSel.value    = { screenId: null, ids: [] }
  }

  function isMultiSel(scId, elId) {
    return multiSel.value.screenId === scId && multiSel.value.ids.includes(elId)
  }

  // Shift-click: toggle an element in the multi-selection
  function toggleMulti(scId, elId) {
    if (multiSel.value.screenId !== scId) {
      const seed = selectedEl.value?.screenId === scId ? [selectedEl.value.elId] : []
      multiSel.value = { screenId: scId, ids: seed }
    }
    const ids = multiSel.value.ids
    const i = ids.indexOf(elId)
    if (i >= 0) ids.splice(i, 1)
    else ids.push(elId)
    activeScreenId.value = scId
    selectedEl.value = ids.length ? { screenId: scId, elId: ids[ids.length - 1] } : null
    selectedSub.value = null
  }

  function groupSelection() {
    const { screenId, ids } = multiSel.value
    if (ids.length < 2) return
    const sc = screens.value.find(s => s.id === screenId)
    if (!sc) return
    const members = sc.elements.filter(e => ids.includes(e.id))
    if (members.length < 2) return
    const minX = Math.min(...members.map(e => e.pos.x))
    const minY = Math.min(...members.map(e => e.pos.y))
    const group = {
      id:   `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'group',
      name: `Group ${sc.elements.filter(e => e.type === 'group').length + 1}`,
      pos:  { x: minX, y: minY },
      config: {},
      interaction: { action: 'none', alertText: '', navigateTo: null, confirmTarget: null, confirmAcceptNavigateTo: null },
      children: members.map(e => ({ ...e, pos: { x: e.pos.x - minX, y: e.pos.y - minY } })),
    }
    sc.elements = sc.elements.filter(e => !ids.includes(e.id))
    sc.elements.push(group)
    multiSel.value = { screenId: null, ids: [] }
    selectedEl.value = { screenId, elId: group.id }
  }

  function ungroup(scId, elId) {
    const sc = screens.value.find(s => s.id === scId)
    const group = sc?.elements.find(e => e.id === elId)
    if (!group || group.type !== 'group') return
    const freed = group.children.map(c => ({
      ...c,
      pos: { x: c.pos.x + group.pos.x, y: c.pos.y + group.pos.y },
    }))
    sc.elements = sc.elements.filter(e => e.id !== elId).concat(freed)
    multiSel.value = { screenId: scId, ids: freed.map(c => c.id) }
    selectedEl.value = { screenId: scId, elId: freed[0].id }
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

  function addElement(type, configOverrides) {
    const sc = activeScreen.value
    if (!sc) return
    const el = makeElement(type)
    if (configOverrides) Object.assign(el.config, configOverrides)
    if (type === 'prime' && el.config.component) el.name = el.config.component
    if (type === 'custom' && el.config.libId) {
      el.name = useLibrary().getComponent(el.config.libId)?.name ?? 'Component'
    }
    if (type !== 'megamenu' && sc.elements.length > 0) {
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
    selectedEl, selectedSub, activeElement, multiSel,
    isElSel, isSubSel, isMultiSel, clearSelection,
    clickEl, clickSub, addElement, deleteEl,
    toggleMulti, groupSelection, ungroup,
  }
}

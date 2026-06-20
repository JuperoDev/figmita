import { ref, computed } from 'vue'
import { makeScreen } from './useFactories.js'

const _home          = makeScreen('Home')
const screens        = ref([_home])
const activeScreenId = ref(_home.id)
const startScreenId  = ref(_home.id)
const renamingId     = ref(null)

const activeScreen = computed(() =>
  screens.value.find(s => s.id === activeScreenId.value) ?? screens.value[0]
)

export function useScreens() {
  function addScreen() {
    const s = makeScreen(`Screen ${screens.value.length + 1}`)
    screens.value.push(s)
    activeScreenId.value = s.id
    return screens.value.length - 1
  }

  function deleteScreen(id) {
    if (screens.value.length <= 1) return
    const i = screens.value.findIndex(s => s.id === id)
    screens.value.splice(i, 1)
    if (activeScreenId.value === id)
      activeScreenId.value = screens.value[Math.max(0, i - 1)].id
    if (startScreenId.value === id)
      startScreenId.value = screens.value[0].id
  }

  return { screens, activeScreenId, startScreenId, renamingId, activeScreen, addScreen, deleteScreen }
}

import { watch } from 'vue'
import { useScreens } from './useScreens.js'

const STORAGE_KEY = 'figmita-proto'
const SAVE_DELAY   = 400

export function useAutosave() {
  const { screens, activeScreenId, startScreenId } = useScreens()

  function loadAutosave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return false
      const d = JSON.parse(raw)
      if (!d.screens?.length) return false
      screens.value        = d.screens
      activeScreenId.value = d.activeScreenId ?? d.screens[0].id
      startScreenId.value  = d.startScreenId ?? d.screens[0].id
      return true
    } catch {
      return false
    }
  }

  function setupAutosave() {
    let timer = null
    watch([screens, activeScreenId, startScreenId], () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          screens: screens.value,
          activeScreenId: activeScreenId.value,
          startScreenId: startScreenId.value,
        }))
      }, SAVE_DELAY)
    }, { deep: true })
  }

  return { loadAutosave, setupAutosave }
}

import { ref, computed } from 'vue'
import { useScreens } from './useScreens.js'

const toast = ref('')
let toastTimer = null

export function useShare() {
  const { screens, startScreenId } = useScreens()

  const protoJson = computed(() =>
    JSON.stringify({ startScreenId: startScreenId.value, screens: screens.value }, null, 2)
  )

  function showToast(msg) {
    clearTimeout(toastTimer)
    toast.value = msg
    toastTimer  = setTimeout(() => { toast.value = '' }, 2200)
  }

  function copyJson() {
    navigator.clipboard.writeText(protoJson.value)
    showToast('JSON copied!')
  }

  function copyLink() {
    const enc = btoa(unescape(encodeURIComponent(
      JSON.stringify({ startScreenId: startScreenId.value, screens: screens.value })
    )))
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?proto=${enc}`)
    showToast('Share link copied!')
  }

  return { protoJson, toast, showToast, copyJson, copyLink }
}

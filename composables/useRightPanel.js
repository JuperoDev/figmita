import { ref, computed } from 'vue'
import { useScreens } from './useScreens.js'
import { useElements } from './useElements.js'

const rightTab = ref('screen')

export function useRightPanel() {
  const { screens, activeScreenId } = useScreens()
  const { selectedEl } = useElements()

  const otherScreens = computed(() =>
    screens.value.filter(s => s.id !== (selectedEl.value?.screenId ?? activeScreenId.value))
  )

  const confirmDialogElements = computed(() =>
    screens.value.flatMap(s => s.elements.filter(e => e.type === 'confirmdialog'))
  )

  return { rightTab, otherScreens, confirmDialogElements }
}

import { ref } from 'vue'
import { useElements } from './useElements.js'

const newFeature = ref('')

export const iconOptions = [
  { label: 'Bolt',     value: 'pi-bolt'      },
  { label: 'Star',     value: 'pi-star'      },
  { label: 'Heart',    value: 'pi-heart'     },
  { label: 'Box',      value: 'pi-box'       },
  { label: 'Chart',    value: 'pi-chart-bar' },
  { label: 'Shield',   value: 'pi-shield'    },
  { label: 'Rocket',   value: 'pi-send'      },
  { label: 'Sparkles', value: 'pi-sparkles'  },
  { label: 'Crown',    value: 'pi-crown'     },
]

export const severityOptions = ['success', 'info', 'warn', 'danger', 'secondary', 'contrast']

export const actionOptions = [
  { value: 'alert',          label: 'Show Alert'       },
  { value: 'navigate',       label: 'Navigate'         },
  { value: 'alert+navigate', label: 'Alert → Navigate' },
]

export function useEditor() {
  const { activeElement } = useElements()

  function addFeature() {
    const v = newFeature.value.trim()
    if (v && activeElement.value) {
      activeElement.value.config.features.push(v)
      newFeature.value = ''
    }
  }

  function removeFeature(i) { activeElement.value?.config.features.splice(i, 1) }
  function updateFeature(i, v) { if (activeElement.value) activeElement.value.config.features[i] = v }

  return { newFeature, iconOptions, severityOptions, actionOptions, addFeature, removeFeature, updateFeature }
}

<script setup>
import { computed } from 'vue'
import { SCREEN_W } from '~/composables/useConstants.js'

const props = defineProps({
  config: { type: Object, required: true },
})

// PrimeVue's MegaMenu expects a top-level item's `items` to be an array of
// *columns*, where each column is itself an array containing one group
// header object that carries the actual flat `items` (the clickable links)
// — see node_modules/primevue/megamenu/MegaMenu.vue's createProcessedItems().
// Our authored config (item.columns[].items) already maps to that 1:1, one
// authored column per rendered column, so this just wraps each in its own
// single-element array.
const resolvedModel = computed(() =>
  props.config.items.map(item => ({
    label: item.label,
    icon:  item.icon,
    items: item.columns?.length
      ? item.columns.map(col => [{
          label: col.label,
          items: col.items.map(link => ({ label: link.label, icon: link.icon })),
        }])
      : undefined,
  }))
)
</script>

<template>
  <MegaMenu
    :model="resolvedModel"
    :orientation="config.orientation"
    :breakpoint="config.breakpoint"
    :scroll-height="config.scrollHeight"
    :disabled="config.disabled"
    :aria-label="config.ariaLabel"
    :style="{ width: SCREEN_W + 'px' }"
  />
</template>

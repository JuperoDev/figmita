<script setup>
import { computed } from 'vue'

const props = defineProps({
  config:   { type: Object,  required: true },
  playMode: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

function onClick() {
  if (props.playMode) emit('click')
}

const polyPoints = computed(() => {
  const c = props.config
  const n = Math.max(3, c.sides ?? 5)
  const inset = (c.strokeWidth ?? 0) / 2
  const rx = c.w / 2 - inset
  const ry = c.h / 2 - inset
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    pts.push(`${(c.w / 2 + rx * Math.cos(a)).toFixed(1)},${(c.h / 2 + ry * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
})
</script>

<template>
  <svg
    class="shape-mock" :width="config.w" :height="config.h"
    :style="{ opacity: (config.opacity ?? 100) / 100 }" @click="onClick"
  >
    <ellipse
      v-if="config.kind === 'ellipse'"
      :cx="config.w / 2" :cy="config.h / 2"
      :rx="Math.max(1, config.w / 2 - (config.strokeWidth ?? 0) / 2)"
      :ry="Math.max(1, config.h / 2 - (config.strokeWidth ?? 0) / 2)"
      :fill="config.fill" :stroke="config.stroke" :stroke-width="config.strokeWidth"
    />
    <polygon
      v-else
      :points="polyPoints"
      :fill="config.fill" :stroke="config.stroke" :stroke-width="config.strokeWidth"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.shape-mock { display: block; }
</style>

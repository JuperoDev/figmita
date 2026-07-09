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

const size = computed(() => {
  const pts = props.config.points || []
  return {
    w: Math.max(1, ...pts.map(p => p.x)) + (props.config.strokeWidth ?? 3),
    h: Math.max(1, ...pts.map(p => p.y)) + (props.config.strokeWidth ?? 3),
  }
})

function pathFrom(points, smooth) {
  if (!points?.length) return ''
  if (!smooth || points.length < 3) {
    return `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
  }
  // pen: quadratic curves through midpoints for a smooth stroke
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2
    const my = (points[i].y + points[i + 1].y) / 2
    d += ` Q ${points[i].x} ${points[i].y} ${mx} ${my}`
  }
  const last = points[points.length - 1]
  d += ` L ${last.x} ${last.y}`
  return d
}

const path = computed(() => pathFrom(props.config.points, props.config.smooth))
</script>

<template>
  <svg class="draw-mock" :width="size.w" :height="size.h" @click="onClick">
    <path
      :d="path" fill="none"
      :stroke="config.stroke" :stroke-width="config.strokeWidth"
      stroke-linecap="round" stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.draw-mock { display: block; overflow: visible; }
</style>

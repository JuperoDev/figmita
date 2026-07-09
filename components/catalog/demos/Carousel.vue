<script setup>
import { ref } from 'vue'

// Self-contained placeholder images so the demo works offline
const svgImage = (color, label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>` +
    `<rect width='100%' height='100%' fill='${color}'/>` +
    `<text x='50%' y='50%' fill='white' font-size='50' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`,
  )}`

const items = ref(['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  .map((color, i) => ({ name: `Slide ${i + 1}`, image: svgImage(color, `Slide ${i + 1}`) })))
</script>

<template>
  <Carousel :value="items" :num-visible="3" :num-scroll="1" circular style="width: 100%">
    <template #item="{ data }">
      <div style="padding: .5rem">
        <img :src="data.image" :alt="data.name" style="width: 100%; border-radius: 8px; display: block;">
      </div>
    </template>
  </Carousel>
</template>

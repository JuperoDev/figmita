<script setup>
import { ref } from 'vue'

const svgImage = (color, label, w = 600, h = 400) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
    `<rect width='100%' height='100%' fill='${color}'/>` +
    `<text x='50%' y='50%' fill='white' font-size='${Math.round(h / 8)}' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`,
  )}`

const images = ref(['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']
  .map((color, i) => ({
    itemImageSrc: svgImage(color, `Photo ${i + 1}`),
    thumbnailImageSrc: svgImage(color, `${i + 1}`, 120, 80),
    alt: `Photo ${i + 1}`,
  })))
</script>

<template>
  <Galleria :value="images" :num-visible="5" container-style="max-width: 480px">
    <template #item="{ item }">
      <img :src="item.itemImageSrc" :alt="item.alt" style="width: 100%; display: block;">
    </template>
    <template #thumbnail="{ item }">
      <img :src="item.thumbnailImageSrc" :alt="item.alt" style="display: block;">
    </template>
  </Galleria>
</template>

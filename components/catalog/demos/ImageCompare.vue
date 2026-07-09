<script setup>
const svgImage = (color, label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='340'>` +
    `<rect width='100%' height='100%' fill='${color}'/>` +
    `<text x='50%' y='50%' fill='white' font-size='44' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`,
  )}`
</script>

<template>
  <ImageCompare style="width: 100%; max-width: 480px">
    <template #left>
      <img :src="svgImage('#64748b', 'Before')" alt="Before">
    </template>
    <template #right>
      <img :src="svgImage('#6366f1', 'After')" alt="After">
    </template>
  </ImageCompare>
</template>

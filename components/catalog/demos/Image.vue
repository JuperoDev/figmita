<script setup>
const src = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'>` +
  `<rect width='100%' height='100%' fill='#0ea5e9'/>` +
  `<text x='50%' y='50%' fill='white' font-size='28' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>Click to preview</text></svg>`,
)}`
</script>

<template>
  <Image :src="src" alt="Preview demo" preview width="220" />
</template>

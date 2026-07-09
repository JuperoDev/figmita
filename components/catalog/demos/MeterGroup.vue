<script setup>
import { ref } from 'vue'

const value = ref([
  { label: 'Apps', value: 24, color: '#6366f1' },
  { label: 'Messages', value: 16, color: '#0ea5e9' },
  { label: 'Media', value: 32, color: '#10b981' },
  { label: 'System', value: 10, color: '#f59e0b' },
])
</script>

<template>
  <MeterGroup :value="value" style="width: 100%" />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(50)
const range = ref([20, 80])
</script>

<template>
  <div style="width: 14rem">
    <Slider v-model="value" />
  </div>
  <div style="width: 14rem">
    <Slider v-model="range" range />
  </div>
</template>

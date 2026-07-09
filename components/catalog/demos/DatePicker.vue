<script setup>
import { ref } from 'vue'

const date = ref(null)
const range = ref(null)
</script>

<template>
  <DatePicker v-model="date" placeholder="Basic" show-icon />
  <DatePicker v-model="range" selection-mode="range" placeholder="Range" :manual-input="false" />
</template>

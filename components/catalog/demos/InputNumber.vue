<script setup>
import { ref } from 'vue'

const value = ref(42)
const currency = ref(1500)
</script>

<template>
  <InputNumber v-model="value" show-buttons :min="0" :max="100" />
  <InputNumber v-model="currency" mode="currency" currency="USD" locale="en-US" />
</template>

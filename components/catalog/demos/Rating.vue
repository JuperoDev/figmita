<script setup>
import { ref } from 'vue'

const value = ref(4)
</script>

<template>
  <Rating v-model="value" />
  <Rating :model-value="3" readonly />
</template>

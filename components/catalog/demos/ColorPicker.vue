<script setup>
import { ref } from 'vue'

const color = ref('6466f1')
</script>

<template>
  <ColorPicker v-model="color" />
  <span>#{{ color }}</span>
</template>

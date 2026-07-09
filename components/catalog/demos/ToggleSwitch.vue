<script setup>
import { ref } from 'vue'

const checked = ref(true)
</script>

<template>
  <ToggleSwitch v-model="checked" />
</template>

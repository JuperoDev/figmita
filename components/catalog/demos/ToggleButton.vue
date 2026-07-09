<script setup>
import { ref } from 'vue'

const checked = ref(false)
</script>

<template>
  <ToggleButton
    v-model="checked" on-label="Locked" off-label="Unlocked"
    on-icon="pi pi-lock" off-icon="pi pi-lock-open"
  />
</template>

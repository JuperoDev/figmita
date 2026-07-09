<script setup>
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <Password v-model="value" toggle-mask placeholder="Password" />
</template>

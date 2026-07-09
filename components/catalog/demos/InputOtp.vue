<script setup>
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <InputOtp v-model="value" />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <Textarea v-model="value" rows="4" cols="30" placeholder="Your message" auto-resize />
</template>

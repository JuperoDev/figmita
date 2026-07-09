<script setup>
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <InputText v-model="value" placeholder="Type something" />
  <InputText placeholder="Small" size="small" />
  <InputText placeholder="Disabled" disabled />
  <InputText placeholder="Invalid" invalid />
</template>

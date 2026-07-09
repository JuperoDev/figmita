<script setup>
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <IconField>
    <InputIcon class="pi pi-search" />
    <InputText v-model="value" placeholder="Search" />
  </IconField>

  <IconField>
    <InputText placeholder="Right icon" />
    <InputIcon class="pi pi-spin pi-spinner" />
  </IconField>
</template>

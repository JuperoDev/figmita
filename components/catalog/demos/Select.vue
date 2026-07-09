<script setup>
import { ref } from 'vue'

const value = ref(null)
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
])
</script>

<template>
  <Select v-model="value" :options="cities" option-label="name" placeholder="Select a city" style="min-width: 14rem" />
  <Select v-model="value" :options="cities" option-label="name" placeholder="Editable" editable style="min-width: 14rem" />
</template>

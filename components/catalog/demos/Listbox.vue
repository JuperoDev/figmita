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
  <Listbox v-model="value" :options="cities" option-label="name" style="width: 14rem" />
</template>

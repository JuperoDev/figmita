<script setup>
import { ref } from 'vue'

const value = ref('One-Way')
</script>

<template>
  <SelectButton v-model="value" :options="['One-Way', 'Return']" />
</template>

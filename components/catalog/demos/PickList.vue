<script setup>
import { ref } from 'vue'

const value = ref([
  ['Vue', 'React', 'Angular', 'Svelte'],
  ['Solid'],
])
</script>

<template>
  <PickList v-model="value" breakpoint="575px" style="width: 100%">
    <template #option="{ option }">{{ option }}</template>
  </PickList>
</template>

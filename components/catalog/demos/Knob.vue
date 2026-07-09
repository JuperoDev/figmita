<script setup>
import { ref } from 'vue'

const value = ref(60)
</script>

<template>
  <Knob v-model="value" value-template="{value}%" />
</template>

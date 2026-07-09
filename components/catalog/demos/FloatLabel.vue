<script setup>
import { ref } from 'vue'

const value = ref('')
const overValue = ref('')
</script>

<template>
  <FloatLabel>
    <InputText id="fl-in" v-model="value" />
    <label for="fl-in">Username</label>
  </FloatLabel>

  <FloatLabel variant="on">
    <InputText id="fl-on" v-model="overValue" />
    <label for="fl-on">On variant</label>
  </FloatLabel>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('Cheese')
</script>

<template>
  <div v-for="topping in ['Cheese', 'Mushroom', 'Pepper']" :key="topping" class="flex items-center gap-2">
    <RadioButton v-model="value" :input-id="`rb-${topping}`" :value="topping" />
    <label :for="`rb-${topping}`">{{ topping }}</label>
  </div>
</template>

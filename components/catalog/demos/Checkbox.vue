<script setup>
import { ref } from 'vue'

const checked = ref(true)
const pizza = ref(['Cheese'])
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox v-model="checked" input-id="binary" binary />
    <label for="binary">Remember me</label>
  </div>

  <div v-for="topping in ['Cheese', 'Mushroom', 'Pepper']" :key="topping" class="flex items-center gap-2">
    <Checkbox v-model="pizza" :input-id="topping" :value="topping" />
    <label :for="topping">{{ topping }}</label>
  </div>
</template>

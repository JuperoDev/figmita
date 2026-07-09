<script setup>
import { ref } from 'vue'

const cities = ref(['San Francisco', 'London', 'Paris', 'Istanbul', 'Berlin'])
</script>

<template>
  <OrderList v-model="cities" breakpoint="575px">
    <template #option="{ option }">{{ option }}</template>
  </OrderList>
</template>

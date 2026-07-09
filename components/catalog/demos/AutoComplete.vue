<script setup>
import { ref } from 'vue'

const value = ref('')
const suggestions = ref([])
const cities = ['New York', 'Rome', 'London', 'Istanbul', 'Paris', 'Berlin', 'Tokyo']

const search = (event) => {
  suggestions.value = cities.filter(c =>
    c.toLowerCase().includes(event.query.toLowerCase()))
}
</script>

<template>
  <AutoComplete v-model="value" :suggestions="suggestions" placeholder="Search cities" @complete="search" />
</template>

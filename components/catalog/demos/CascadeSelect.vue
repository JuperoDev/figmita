<script setup>
import { ref } from 'vue'

const value = ref(null)
const options = ref([
  {
    name: 'Australia', code: 'AU',
    states: [
      { name: 'New South Wales', cities: [{ cname: 'Sydney', code: 'A-SY' }, { cname: 'Newcastle', code: 'A-NE' }] },
      { name: 'Queensland', cities: [{ cname: 'Brisbane', code: 'A-BR' }] },
    ],
  },
  {
    name: 'United States', code: 'US',
    states: [
      { name: 'California', cities: [{ cname: 'Los Angeles', code: 'US-LA' }, { cname: 'San Francisco', code: 'US-SF' }] },
      { name: 'Florida', cities: [{ cname: 'Miami', code: 'US-MI' }] },
    ],
  },
])
</script>

<template>
  <CascadeSelect
    v-model="value" :options="options" option-label="cname" option-group-label="name"
    :option-group-children="['states', 'cities']" placeholder="Select a city" style="min-width: 14rem"
  />
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const price = ref(null)
</script>

<template>
  <InputGroup style="max-width: 20rem">
    <InputGroupAddon><i class="pi pi-user" /></InputGroupAddon>
    <InputText v-model="username" placeholder="Username" />
    <InputGroupAddon>@figmita.dev</InputGroupAddon>
  </InputGroup>

  <InputGroup style="max-width: 20rem">
    <InputGroupAddon>$</InputGroupAddon>
    <InputNumber v-model="price" placeholder="Price" />
    <InputGroupAddon>.00</InputGroupAddon>
  </InputGroup>
</template>

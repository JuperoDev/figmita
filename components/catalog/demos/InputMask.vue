<script setup>
import { ref } from 'vue'

const phone = ref('')
const serial = ref('')
</script>

<template>
  <InputMask v-model="phone" mask="(999) 999-9999" placeholder="(999) 999-9999" />
  <InputMask v-model="serial" mask="a*-999-a999" placeholder="a*-999-a999" />
</template>

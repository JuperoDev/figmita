<script setup>
import { ref } from 'vue'

const value = ref(null)
const nodes = ref([
  {
    key: '0', label: 'Documents', icon: 'pi pi-folder',
    children: [
      { key: '0-0', label: 'Work', icon: 'pi pi-folder', children: [{ key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-file' }] },
      { key: '0-1', label: 'Home', icon: 'pi pi-folder', children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-file' }] },
    ],
  },
  {
    key: '1', label: 'Pictures', icon: 'pi pi-image',
    children: [{ key: '1-0', label: 'logo.svg', icon: 'pi pi-image' }],
  },
])
</script>

<template>
  <TreeSelect v-model="value" :options="nodes" placeholder="Select an item" style="min-width: 16rem" />
</template>

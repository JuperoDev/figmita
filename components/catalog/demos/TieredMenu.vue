<script setup>
import { ref } from 'vue'

const menu = ref(null)
const items = [
  { label: 'File', icon: 'pi pi-file', items: [{ label: 'New', icon: 'pi pi-plus' }, { label: 'Print', icon: 'pi pi-print' }] },
  { label: 'Edit', icon: 'pi pi-file-edit', items: [{ label: 'Copy', icon: 'pi pi-copy' }, { label: 'Paste', icon: 'pi pi-clipboard' }] },
  { separator: true },
  { label: 'Quit', icon: 'pi pi-times' },
]
</script>

<template>
  <Button label="Toggle menu" icon="pi pi-bars" @click="menu.toggle($event)" />
  <TieredMenu ref="menu" :model="items" popup />
</template>

<script setup>
import { ref } from 'vue'

const menu = ref(null)
const items = [
  { label: 'Copy', icon: 'pi pi-copy' },
  { label: 'Rename', icon: 'pi pi-pencil' },
  { separator: true },
  { label: 'Delete', icon: 'pi pi-trash' },
]
</script>

<template>
  <div
    style="width: 100%; padding: 2.5rem 1rem; text-align: center; border: 1px dashed var(--p-content-border-color); border-radius: 8px; cursor: context-menu;"
    aria-haspopup="true"
    @contextmenu="menu.show($event)"
  >
    Right-click here
  </div>
  <ContextMenu ref="menu" :model="items" />
</template>

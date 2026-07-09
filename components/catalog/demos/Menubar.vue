<script setup>
const items = [
  { label: 'Home', icon: 'pi pi-home' },
  { label: 'Features', icon: 'pi pi-star' },
  {
    label: 'Projects', icon: 'pi pi-search',
    items: [
      { label: 'Components', icon: 'pi pi-bolt' },
      { label: 'Blocks', icon: 'pi pi-server' },
      { label: 'UI Kit', icon: 'pi pi-pencil' },
    ],
  },
  { label: 'Contact', icon: 'pi pi-envelope' },
]
</script>

<template>
  <Menubar :model="items" style="width: 100%" />
</template>

<script setup>
import { ref } from 'vue'

const popupMenu = ref(null)
const items = [
  {
    label: 'Documents',
    items: [
      { label: 'New', icon: 'pi pi-plus' },
      { label: 'Search', icon: 'pi pi-search' },
    ],
  },
  {
    label: 'Profile',
    items: [
      { label: 'Settings', icon: 'pi pi-cog' },
      { label: 'Logout', icon: 'pi pi-sign-out' },
    ],
  },
]
</script>

<template>
  <Menu :model="items" />

  <Button label="Popup menu" icon="pi pi-bars" @click="popupMenu.toggle($event)" />
  <Menu ref="popupMenu" :model="items" popup />
</template>

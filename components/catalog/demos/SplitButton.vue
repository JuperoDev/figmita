<script setup>
const items = [
  { label: 'Update', icon: 'pi pi-refresh' },
  { label: 'Delete', icon: 'pi pi-times' },
  { separator: true },
  { label: 'Quit', icon: 'pi pi-power-off' },
]
</script>

<template>
  <SplitButton label="Save" icon="pi pi-check" :model="items" />
  <SplitButton label="Options" :model="items" severity="secondary" outlined />
</template>

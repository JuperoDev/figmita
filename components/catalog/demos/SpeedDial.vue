<script setup>
const toast = useToast()

const items = [
  { label: 'Add', icon: 'pi pi-pencil', command: () => toast.add({ severity: 'info', summary: 'Add', life: 2000 }) },
  { label: 'Update', icon: 'pi pi-refresh', command: () => toast.add({ severity: 'success', summary: 'Update', life: 2000 }) },
  { label: 'Delete', icon: 'pi pi-trash', command: () => toast.add({ severity: 'error', summary: 'Delete', life: 2000 }) },
]
</script>

<template>
  <div style="position: relative; width: 100%; height: 100px;">
    <SpeedDial :model="items" direction="right" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%);" />
  </div>
</template>

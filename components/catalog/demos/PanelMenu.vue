<script setup>
const items = [
  {
    label: 'Files', icon: 'pi pi-file',
    items: [
      { label: 'Documents', icon: 'pi pi-file', items: [{ label: 'Invoices', icon: 'pi pi-file-pdf' }, { label: 'Reports', icon: 'pi pi-file-excel' }] },
      { label: 'Images', icon: 'pi pi-image' },
    ],
  },
  {
    label: 'Cloud', icon: 'pi pi-cloud',
    items: [
      { label: 'Upload', icon: 'pi pi-cloud-upload' },
      { label: 'Download', icon: 'pi pi-cloud-download' },
    ],
  },
]
</script>

<template>
  <PanelMenu :model="items" style="width: 20rem" />
</template>

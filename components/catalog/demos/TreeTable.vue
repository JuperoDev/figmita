<script setup>
import { ref } from 'vue'

const nodes = ref([
  {
    key: '0', data: { name: 'Applications', size: '100kb', type: 'Folder' },
    children: [
      { key: '0-0', data: { name: 'Vue', size: '25kb', type: 'Folder' }, children: [{ key: '0-0-0', data: { name: 'vue.app', size: '10kb', type: 'Application' } }] },
      { key: '0-1', data: { name: 'editor.app', size: '25kb', type: 'Application' } },
    ],
  },
  {
    key: '1', data: { name: 'Cloud', size: '20kb', type: 'Folder' },
    children: [{ key: '1-0', data: { name: 'backup.zip', size: '10kb', type: 'Zip' } }],
  },
])
</script>

<template>
  <TreeTable :value="nodes" style="width: 100%">
    <Column field="name" header="Name" expander />
    <Column field="size" header="Size" />
    <Column field="type" header="Type" />
  </TreeTable>
</template>

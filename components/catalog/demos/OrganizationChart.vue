<script setup>
import { ref } from 'vue'

const data = ref({
  key: '0',
  label: 'CEO',
  children: [
    { key: '0-0', label: 'CTO', children: [{ key: '0-0-0', label: 'Dev Team' }, { key: '0-0-1', label: 'QA Team' }] },
    { key: '0-1', label: 'CFO', children: [{ key: '0-1-0', label: 'Finance' }] },
  ],
})
</script>

<template>
  <OrganizationChart :value="data" collapsible>
    <template #default="{ node }">{{ node.label }}</template>
  </OrganizationChart>
</template>

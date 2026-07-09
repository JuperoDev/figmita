<script setup>
import { ref } from 'vue'

const nodes = ref([
  {
    key: '0', label: 'src', icon: 'pi pi-folder',
    children: [
      { key: '0-0', label: 'components', icon: 'pi pi-folder', children: [{ key: '0-0-0', label: 'Button.vue', icon: 'pi pi-file' }] },
      { key: '0-1', label: 'pages', icon: 'pi pi-folder', children: [{ key: '0-1-0', label: 'index.vue', icon: 'pi pi-file' }] },
      { key: '0-2', label: 'app.vue', icon: 'pi pi-file' },
    ],
  },
  { key: '1', label: 'package.json', icon: 'pi pi-file' },
])
</script>

<template>
  <Tree :value="nodes" selection-mode="single" style="width: 100%" />
</template>

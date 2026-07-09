<script setup>
import { ref } from 'vue'

const items = ref(Array.from({ length: 10000 }, (_, i) => `Item #${i}`))
</script>

<template>
  <VirtualScroller :items="items" :item-size="38" style="width: 220px; height: 220px; border: 1px solid var(--p-content-border-color); border-radius: 8px">
    <template #item="{ item, options }">
      <div class="flex items-center" style="height: 38px; padding: 0 12px" :style="{ background: options.odd ? 'var(--p-surface-100)' : undefined }">
        {{ item }}
      </div>
    </template>
  </VirtualScroller>
</template>

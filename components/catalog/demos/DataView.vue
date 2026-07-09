<script setup>
import { ref } from 'vue'

const products = ref([
  { name: 'Bamboo Watch', category: 'Accessories', price: 65 },
  { name: 'Black Watch', category: 'Accessories', price: 72 },
  { name: 'Blue Band', category: 'Fitness', price: 79 },
  { name: 'Gaming Set', category: 'Electronics', price: 299 },
])
</script>

<template>
  <DataView :value="products" style="width: 100%">
    <template #list="{ items }">
      <div v-for="item in items" :key="item.name" class="flex items-center justify-between gap-4" style="padding: 12px 8px; border-bottom: 1px solid var(--p-content-border-color)">
        <div>
          <div style="font-weight: 600">{{ item.name }}</div>
          <div style="font-size: 12px; opacity: .7">{{ item.category }}</div>
        </div>
        <div class="flex items-center gap-3">
          <span style="font-weight: 600">${{ item.price }}</span>
          <Button icon="pi pi-shopping-cart" rounded />
        </div>
      </div>
    </template>
  </DataView>
</template>

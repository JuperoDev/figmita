<script setup>
import { ref } from 'vue'

const products = ref([
  { code: 'P-1001', name: 'Bamboo Watch', category: 'Accessories', price: 65, stock: 24 },
  { code: 'P-1002', name: 'Black Watch', category: 'Accessories', price: 72, stock: 61 },
  { code: 'P-1003', name: 'Blue Band', category: 'Fitness', price: 79, stock: 2 },
  { code: 'P-1004', name: 'Blue T-Shirt', category: 'Clothing', price: 29, stock: 25 },
  { code: 'P-1005', name: 'Gaming Set', category: 'Electronics', price: 299, stock: 63 },
])
</script>

<template>
  <DataTable :value="products" paginator :rows="3" striped-rows style="width: 100%">
    <Column field="code" header="Code" sortable />
    <Column field="name" header="Name" sortable />
    <Column field="category" header="Category" sortable />
    <Column field="price" header="Price" sortable>
      <template #body="{ data }">${{ data.price }}</template>
    </Column>
    <Column field="stock" header="Stock">
      <template #body="{ data }">
        <Tag :value="data.stock" :severity="data.stock < 10 ? 'danger' : 'success'" />
      </template>
    </Column>
  </DataTable>
</template>

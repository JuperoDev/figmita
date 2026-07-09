<script setup>
import { ref } from 'vue'

const events = ref([
  { status: 'Ordered', date: '15/06/2026 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
  { status: 'Processing', date: '15/06/2026 14:00', icon: 'pi pi-cog', color: '#673AB7' },
  { status: 'Shipped', date: '16/06/2026 16:15', icon: 'pi pi-envelope', color: '#FF9800' },
  { status: 'Delivered', date: '18/06/2026 10:00', icon: 'pi pi-check', color: '#607D8B' },
])
</script>

<template>
  <Timeline :value="events" style="width: 100%">
    <template #marker="{ item }">
      <span class="flex items-center justify-center" style="width: 2rem; height: 2rem; border-radius: 50%; color: #fff;" :style="{ background: item.color }">
        <i :class="item.icon" />
      </span>
    </template>
    <template #content="{ item }">
      <div style="font-weight: 600">{{ item.status }}</div>
      <div style="font-size: 12px; opacity: .7">{{ item.date }}</div>
    </template>
  </Timeline>
</template>

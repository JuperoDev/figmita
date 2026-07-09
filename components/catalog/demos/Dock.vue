<script setup>
const items = [
  { label: 'Finder', icon: 'pi pi-folder' },
  { label: 'Terminal', icon: 'pi pi-code' },
  { label: 'App Store', icon: 'pi pi-shopping-bag' },
  { label: 'Safari', icon: 'pi pi-globe' },
  { label: 'Photos', icon: 'pi pi-image' },
]
</script>

<template>
  <div style="position: relative; width: 100%; height: 180px; border: 1px solid var(--p-content-border-color); border-radius: 8px; overflow: hidden;">
    <Dock :model="items" position="bottom" style="position: absolute">
      <template #item="{ item }">
        <span v-tooltip.top="item.label" class="flex items-center justify-center" style="width: 100%; height: 100%; font-size: 1.6rem; cursor: pointer">
          <i :class="item.icon" />
        </span>
      </template>
    </Dock>
  </div>
</template>

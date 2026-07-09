<script setup>
const home = { icon: 'pi pi-home', url: '#' }
const items = [{ label: 'Projects' }, { label: 'Figmita' }, { label: 'Catalog' }]
</script>

<template>
  <Breadcrumb :home="home" :model="items" style="width: 100%" />
</template>

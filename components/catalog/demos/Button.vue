<script setup>
import { ref } from 'vue'

const loading = ref(false)
const load = () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 1500)
}
</script>

<template>
  <Button label="Primary" />
  <Button label="Secondary" severity="secondary" />
  <Button label="Success" severity="success" />
  <Button label="Info" severity="info" />
  <Button label="Warn" severity="warn" />
  <Button label="Danger" severity="danger" />
  <Button label="Help" severity="help" />
  <Button label="Contrast" severity="contrast" />
  <Button label="Outlined" outlined />
  <Button label="Text" text />
  <Button label="Raised" raised />
  <Button label="Rounded" rounded />
  <Button label="Link" link />
  <Button icon="pi pi-check" aria-label="Check" />
  <Button icon="pi pi-bookmark" severity="secondary" rounded outlined aria-label="Bookmark" />
  <Button label="Search" icon="pi pi-search" icon-pos="right" />
  <Button label="Save" icon="pi pi-save" :loading="loading" @click="load" />
  <Button label="Disabled" disabled />
  <Button label="Badge" icon="pi pi-inbox" badge="4" badge-severity="danger" outlined />
</template>

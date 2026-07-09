<script setup>
const toast = useToast()

const show = (severity, summary) =>
  toast.add({ severity, summary, detail: 'Message content', life: 3000 })
</script>

<template>
  <Button label="Success" severity="success" @click="show('success', 'Success')" />
  <Button label="Info" severity="info" @click="show('info', 'Info')" />
  <Button label="Warn" severity="warn" @click="show('warn', 'Warning')" />
  <Button label="Error" severity="danger" @click="show('error', 'Error')" />
</template>

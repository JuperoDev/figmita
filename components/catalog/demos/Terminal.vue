<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import TerminalService from 'primevue/terminalservice'

const onCommand = (text) => {
  const responses = {
    date: new Date().toDateString(),
    greet: 'Hola from figmita!',
    random: String(Math.floor(Math.random() * 100)),
  }
  TerminalService.emit('response', responses[text] ?? `Unknown command: ${text} (try: date, greet, random)`)
}

onMounted(() => TerminalService.on('command', onCommand))
onBeforeUnmount(() => TerminalService.off('command', onCommand))
</script>

<template>
  <Terminal
    welcome-message="Welcome to figmita. Type date, greet or random."
    prompt="figmita $"
    style="width: 100%"
  />
</template>

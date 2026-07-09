<script setup>
import { ref } from 'vue'

const popover = ref(null)
</script>

<template>
  <Button label="Show popover" icon="pi pi-comment" @click="popover.toggle($event)" />

  <Popover ref="popover">
    <div style="max-width: 18rem">
      <div style="font-weight: 600; margin-bottom: .5rem">Share this prototype</div>
      <InputGroup>
        <InputText value="https://figmita.dev/p/abc123" readonly />
        <Button icon="pi pi-copy" severity="secondary" />
      </InputGroup>
    </div>
  </Popover>
</template>

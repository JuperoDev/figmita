<script setup>
import { ref } from 'vue'

const visible = ref(false)
const position = ref('left')

const open = (pos) => {
  position.value = pos
  visible.value = true
}
</script>

<template>
  <Button label="Left" icon="pi pi-arrow-right" @click="open('left')" />
  <Button label="Right" icon="pi pi-arrow-left" @click="open('right')" />
  <Button label="Bottom" icon="pi pi-arrow-up" @click="open('bottom')" />
  <Button label="Full" icon="pi pi-window-maximize" @click="open('full')" />

  <Drawer v-model:visible="visible" :position="position" header="Drawer">
    <p>Content slides in from the {{ position }} edge.</p>
  </Drawer>
</template>

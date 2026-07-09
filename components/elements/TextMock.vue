<script setup>
import { computed } from 'vue'

const props = defineProps({
  config:   { type: Object,  required: true },
  playMode: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

function onClick() {
  if (props.playMode) emit('click')
}

const textStyle = computed(() => {
  const c = props.config
  return {
    fontSize:      c.fontSize + 'px',
    fontWeight:    c.weight,
    color:         c.color,
    textAlign:     c.align,
    fontStyle:     c.italic ? 'italic' : 'normal',
    letterSpacing: (c.letterSpacing ?? 0) + 'px',
  }
})
</script>

<template>
  <component :is="config.tag || 'p'" class="text-mock" :style="textStyle" @click="onClick">{{ config.text }}</component>
</template>

<style scoped>
.text-mock {
  margin: 0;
  white-space: pre-wrap;
  max-width: 640px;
  line-height: 1.25;
  font-family: 'Inter', system-ui, sans-serif;
}
</style>

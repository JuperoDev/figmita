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

const SHADOWS = {
  none: 'none',
  sm:   '0 1px 3px rgba(0,0,0,.18)',
  md:   '0 6px 16px rgba(0,0,0,.22)',
  lg:   '0 16px 40px rgba(0,0,0,.3)',
}

const boxStyle = computed(() => {
  const c = props.config
  return {
    width:          c.w + 'px',
    height:         c.h + 'px',
    background:     c.fill,
    border:         c.borderWidth > 0 ? `${c.borderWidth}px ${c.borderStyle} ${c.borderColor}` : 'none',
    borderRadius:   c.radius + 'px',
    boxShadow:      SHADOWS[c.shadow] ?? 'none',
    opacity:        (c.opacity ?? 100) / 100,
    color:          c.textColor,
    fontSize:       c.fontSize + 'px',
    justifyContent: c.align === 'left' ? 'flex-start' : c.align === 'right' ? 'flex-end' : 'center',
  }
})
</script>

<template>
  <div class="box-mock" :style="boxStyle" @click="onClick">
    <span v-if="config.text" class="box-text">{{ config.text }}</span>
  </div>
</template>

<style scoped>
.box-mock {
  box-sizing: border-box;
  display: flex; align-items: center;
  padding: 0 12px; overflow: hidden;
}
.box-text { white-space: pre-wrap; text-align: inherit; }
</style>

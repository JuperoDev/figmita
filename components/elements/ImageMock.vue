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

const imgStyle = computed(() => ({
  width:        props.config.w + 'px',
  height:       props.config.h + 'px',
  objectFit:    props.config.fit ?? 'cover',
  borderRadius: (props.config.radius ?? 0) + 'px',
}))
</script>

<template>
  <img
    class="image-mock" :src="config.src" :alt="config.alt || 'Image'"
    :style="imgStyle" draggable="false" @click="onClick"
  >
</template>

<style scoped>
.image-mock { display: block; user-select: none; }
</style>

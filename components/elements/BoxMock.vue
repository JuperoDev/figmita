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
  // Boxes drawn before per-side borders / per-corner radii existed
  const sides = c.sides ?? { t: true, r: true, b: true, l: true }
  const radii = c.radii ?? { tl: c.radius ?? 0, tr: c.radius ?? 0, br: c.radius ?? 0, bl: c.radius ?? 0 }
  const edge = on => (on && c.borderWidth > 0 ? `${c.borderWidth}px ${c.borderStyle} ${c.borderColor}` : 'none')

  let background = c.fill
  if (c.fillType === 'gradient') background = `linear-gradient(${c.gradAngle ?? 135}deg, ${c.gradFrom}, ${c.gradTo})`
  else if (c.fillType === 'image' && c.imageSrc) background = `url("${c.imageSrc}") center / ${c.imageFit ?? 'cover'} no-repeat`

  return {
    width:          c.w + 'px',
    height:         c.h + 'px',
    background,
    borderTop:      edge(sides.t),
    borderRight:    edge(sides.r),
    borderBottom:   edge(sides.b),
    borderLeft:     edge(sides.l),
    borderRadius:   `${radii.tl}px ${radii.tr}px ${radii.br}px ${radii.bl}px`,
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

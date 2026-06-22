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

const colorVars = computed(() => {
  const c = props.config
  const key = c.severity || 'primary'
  const vars = {}
  if (c.bgColor)        { vars[`--p-button-${key}-background`]       = c.bgColor;      vars[`--p-button-${key}-border-color`]       = c.bgColor }
  if (c.textColor)      { vars[`--p-button-${key}-color`]             = c.textColor }
  if (c.hoverBgColor)   { vars[`--p-button-${key}-hover-background`]  = c.hoverBgColor; vars[`--p-button-${key}-hover-border-color`] = c.hoverBgColor }
  if (c.hoverTextColor) { vars[`--p-button-${key}-hover-color`]       = c.hoverTextColor }
  return vars
})
</script>

<template>
  <div class="button-mock" :style="colorVars">
    <Button v-bind="config" :severity="config.severity || undefined" @click="onClick" />
  </div>
</template>

<style scoped>
.button-mock { display:inline-block; }
</style>

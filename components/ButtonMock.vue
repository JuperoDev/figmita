<script setup>
const props = defineProps({
  config:   { type: Object,  required: true },
  playMode: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

function onClick() {
  if (props.playMode) emit('click')
}
</script>

<template>
  <div class="button-mock">
    <Button v-bind="config" :severity="config.severity || undefined" @click="onClick" />
  </div>
</template>

<style scoped>
.button-mock { display:inline-block; }
</style>

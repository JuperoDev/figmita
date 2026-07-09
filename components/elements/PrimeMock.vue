<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { playgrounds } from '~/components/catalog/playground'

const props = defineProps({
  config:   { type: Object,  required: true },
  playMode: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

function onClick() {
  if (props.playMode) emit('click')
}

const name = computed(() => props.config.component)
const pg = computed(() => playgrounds[name.value] || null)

// Playground-configured components render bare (props editable via the
// right panel); the rest fall back to their catalog demo as a rich preview
const demoLoaders = import.meta.glob('~/components/catalog/demos/*.vue')
const comp = computed(() => {
  if (pg.value) return defineAsyncComponent(pg.value.load)
  const key = Object.keys(demoLoaders).find(k => k.endsWith(`/${name.value}.vue`))
  return key ? defineAsyncComponent(demoLoaders[key]) : null
})

const model = ref(pg.value && 'model' in pg.value ? pg.value.model : undefined)

const bindings = computed(() => {
  if (!pg.value) return {}
  const b = { ...(pg.value.seed || {}), ...(props.config.props || {}) }
  if ('model' in pg.value) {
    b.modelValue = model.value
    b['onUpdate:modelValue'] = (v) => { model.value = v }
  }
  return b
})

// Demos and some playgrounds size themselves to their container; the canvas
// anchor has no width, so give fluid content a concrete one. Per-element
// design-token overrides ride along as inline custom properties — they win
// over the :root-declared theme values for this element only.
const wrapStyle = computed(() => {
  const base = pg.value
    ? (pg.value.stageStyle || '').replace('100%', '420px')
    : 'width: 420px'
  return [base, props.config.tokens || {}]
})
</script>

<template>
  <div class="prime-mock" :class="{ 'pm-static': !playMode }" :style="wrapStyle" @click="onClick">
    <template v-if="comp">
      <component :is="comp" v-if="pg?.content" v-bind="bindings">{{ pg.content }}</component>
      <component :is="comp" v-else v-bind="bindings" />
    </template>
    <div v-else class="pm-unknown">Unknown component: {{ name }}</div>
  </div>
</template>

<style scoped>
.prime-mock { display: inline-block; }
/* In edit mode clicks fall through to the canvas anchor for select/drag */
.pm-static { pointer-events: none; }
.pm-unknown {
  padding: 10px 14px; border: 1px dashed #f87171; border-radius: 6px;
  color: #b91c1c; font-size: 12px; background: rgba(248,113,113,.08);
}
</style>

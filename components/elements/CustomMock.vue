<script setup>
import { ref, computed, reactive, watchEffect, defineComponent } from 'vue'

const props = defineProps({
  config:   { type: Object,  required: true },
  playMode: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

function onClick() {
  if (props.playMode) emit('click')
}

const { getComponent } = useLibrary()
const lib = computed(() => getComponent(props.config.libId))

// Compile the pasted template into a live component. The optional setup
// body runs as `(ref, computed, reactive) => bindings` so pasted logic can
// declare state used by the template.
const runtime = computed(() => {
  const c = lib.value
  if (!c) return null
  try {
    let setupFn = () => ({})
    if (c.setup?.trim()) {
      // eslint-disable-next-line no-new-func
      setupFn = new Function('ref', 'computed', 'reactive', c.setup)
    }
    return defineComponent({
      name: `Lib${c.id}`,
      template: c.template,
      setup: () => setupFn(ref, computed, reactive) || {},
    })
  } catch {
    return null
  }
})

// Inject the component's CSS once, keyed by library id
watchEffect(() => {
  const c = lib.value
  if (!c || typeof document === 'undefined') return
  const id = `lib-style-${c.id}`
  let tag = document.getElementById(id)
  if (!tag) {
    tag = document.createElement('style')
    tag.id = id
    document.head.appendChild(tag)
  }
  tag.textContent = c.compiledCss || ''
})
</script>

<template>
  <div class="custom-mock" :class="[{ 'cm-static': !playMode }, lib ? `cc-${lib.id}` : '']" @click="onClick">
    <component :is="runtime" v-if="runtime" />
    <div v-else class="cm-broken">
      {{ lib ? 'Template failed to compile' : 'Missing library component' }}
    </div>
  </div>
</template>

<style scoped>
.custom-mock { display: inline-block; }
.cm-static { pointer-events: none; }
.cm-broken {
  padding: 10px 14px; border: 1px dashed #f87171; border-radius: 6px;
  color: #b91c1c; font-size: 12px; background: rgba(248,113,113,.08);
}
</style>

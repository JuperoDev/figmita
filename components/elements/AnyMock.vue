<script setup>
// Renders any element type — the single switch shared by the play overlay
// and group children (recursively). `activate` bubbles the clicked element
// so play mode can fire its interaction.
const props = defineProps({
  el:       { type: Object,  required: true },
  playMode: { type: Boolean, default: false },
})

const emit = defineEmits(['activate'])

const fire = el => props.playMode && emit('activate', el)
</script>

<template>
  <ElementsCardMock
    v-if="el.type === 'card'"
    :config="el.config"
    :play-mode="playMode"
    @btn-click="fire(el)"
  />
  <ElementsMegaMenuMock
    v-else-if="el.type === 'megamenu'"
    :config="el.config"
  />
  <ElementsButtonMock
    v-else-if="el.type === 'button'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <ElementsPrimeMock
    v-else-if="el.type === 'prime'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <ElementsBoxMock
    v-else-if="el.type === 'box'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <ElementsTextMock
    v-else-if="el.type === 'text'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <ElementsCustomMock
    v-else-if="el.type === 'custom'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <ElementsImageMock
    v-else-if="el.type === 'image'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <ElementsShapeMock
    v-else-if="el.type === 'shape'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <ElementsDrawMock
    v-else-if="el.type === 'draw'"
    :config="el.config"
    :play-mode="playMode"
    @click="fire(el)"
  />
  <div v-else-if="el.type === 'group'" class="group-frame">
    <div
      v-for="child in el.children"
      :key="child.id"
      :style="{ position: 'absolute', left: child.pos.x + 'px', top: child.pos.y + 'px' }"
    >
      <ElementsAnyMock :el="child" :play-mode="playMode" @activate="e => emit('activate', e)" />
    </div>
  </div>
</template>

<style scoped>
.group-frame { position: relative; }
</style>

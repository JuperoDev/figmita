<script setup>
import { computed } from 'vue'

const { confirmOverlay, acceptConfirm, rejectConfirm } = usePlayMode()

const POSITIONS = {
  center:      { justifyContent: 'center',     alignItems: 'center'    },
  top:         { justifyContent: 'center',     alignItems: 'flex-start' },
  bottom:      { justifyContent: 'center',     alignItems: 'flex-end'   },
  left:        { justifyContent: 'flex-start', alignItems: 'center'    },
  right:       { justifyContent: 'flex-end',   alignItems: 'center'    },
  topleft:     { justifyContent: 'flex-start', alignItems: 'flex-start' },
  topright:    { justifyContent: 'flex-end',   alignItems: 'flex-start' },
  bottomleft:  { justifyContent: 'flex-start', alignItems: 'flex-end'   },
  bottomright: { justifyContent: 'flex-end',   alignItems: 'flex-end'   },
}

const layoutStyle = computed(() => POSITIONS[confirmOverlay.value.position] ?? POSITIONS.center)
</script>

<template>
  <Transition name="confirm-pop">
    <div
      v-if="confirmOverlay.visible"
      class="confirm-overlay"
      :class="{ 'no-backdrop': confirmOverlay.modal === false }"
      :style="layoutStyle"
      @click.self="confirmOverlay.modal === false && rejectConfirm()"
    >
      <ElementsConfirmDialogCard :config="confirmOverlay" @accept="acceptConfirm" @reject="rejectConfirm" />
    </div>
  </Transition>
</template>

<style scoped>
.confirm-overlay { position:absolute; inset:0; z-index:110; background:rgba(0,0,0,.45); display:flex; padding:24px; backdrop-filter:blur(2px); }
.confirm-overlay.no-backdrop { background:transparent; backdrop-filter:none; pointer-events:none; }
.confirm-overlay.no-backdrop :deep(.confirm-card) { pointer-events:all; }
.confirm-pop-enter-active { transition:all .2s cubic-bezier(.34,1.56,.64,1); }
.confirm-pop-leave-active { transition:all .15s ease; }
.confirm-pop-enter-from,.confirm-pop-leave-to { opacity:0; }
.confirm-pop-enter-from :deep(.confirm-card) { transform:scale(.9); }
.confirm-pop-leave-to   :deep(.confirm-card) { transform:scale(.96); }
</style>

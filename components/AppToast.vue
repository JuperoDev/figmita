<script setup>
const { toast } = useShare()
</script>

<template>
  <Transition name="toast">
    <div v-if="toast" class="copy-toast">{{ toast }}</div>
  </Transition>
</template>

<style scoped>
.copy-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#18181b; border:1px solid #3f3f46; color:#f4f4f5; font-size:13px; padding:8px 18px; border-radius:8px; z-index:9999; pointer-events:none; box-shadow:0 4px 20px rgba(0,0,0,.4); }
.toast-enter-active,.toast-leave-active { transition:all .2s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateX(-50%) translateY(8px); }
</style>

<script setup>
defineProps({
  config: { type: Object, required: true },
})
</script>

<template>
  <div class="confirm-mock">
    <span class="confirm-mock-label">Preview — shown when triggered</span>
    <ConfirmDialogCard :config="config" />
  </div>
</template>

<style scoped>
.confirm-mock { display:inline-flex; flex-direction:column; gap:6px; padding:10px; border:1px dashed #3a3a3a; border-radius:12px; background:rgba(255,255,255,.02); }
.confirm-mock-label { font-size:10px; color:#666; text-transform:uppercase; letter-spacing:.06em; padding-left:2px; }
</style>

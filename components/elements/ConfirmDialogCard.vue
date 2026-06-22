<script setup>
defineProps({
  config: { type: Object, required: true },
})

defineEmits(['accept', 'reject'])
</script>

<template>
  <div class="confirm-card">
    <div class="confirm-header">
      <i v-if="config.icon" :class="config.icon" />
      <span class="confirm-title">{{ config.header || 'Confirm' }}</span>
    </div>
    <div class="confirm-body">
      <p class="confirm-message">{{ config.message }}</p>
    </div>
    <div class="confirm-footer">
      <Button
        :label="config.rejectLabel || 'No'"
        :icon="config.rejectIcon || undefined"
        severity="secondary"
        outlined
        @click="$emit('reject')"
      />
      <Button
        :label="config.acceptLabel || 'Yes'"
        :icon="config.acceptIcon || undefined"
        :autofocus="config.defaultFocus !== 'reject'"
        @click="$emit('accept')"
      />
    </div>
  </div>
</template>

<style scoped>
.confirm-card { width:380px; background:#1e1e1e; border:1px solid #333; border-radius:10px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.5); }
.confirm-header { display:flex; align-items:center; gap:10px; padding:16px 20px 0; font-size:15px; font-weight:600; color:#f0f0f0; }
.confirm-header i { font-size:1.3rem; color:#fbbf24; }
.confirm-body { padding:12px 20px 20px; }
.confirm-message { margin:0; font-size:13px; color:#aaa; line-height:1.6; white-space:pre-wrap; }
.confirm-footer { display:flex; justify-content:flex-end; gap:8px; padding:0 20px 18px; }
</style>

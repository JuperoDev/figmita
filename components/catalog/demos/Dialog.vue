<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <Button label="Show dialog" icon="pi pi-window-maximize" @click="visible = true" />

  <Dialog v-model:visible="visible" modal header="Edit Profile" style="width: 25rem">
    <p style="margin-bottom: 1.25rem; opacity: .7">Update your information.</p>
    <div class="flex flex-col gap-3">
      <InputText placeholder="Username" autocomplete="off" />
      <InputText placeholder="Email" autocomplete="off" />
    </div>
    <template #footer>
      <Button label="Cancel" severity="secondary" text @click="visible = false" />
      <Button label="Save" @click="visible = false" />
    </template>
  </Dialog>
</template>

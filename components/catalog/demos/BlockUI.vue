<script setup>
import { ref } from 'vue'

const blocked = ref(false)
</script>

<template>
  <div style="width: 100%">
    <div class="flex gap-2" style="margin-bottom: .75rem">
      <Button label="Block" @click="blocked = true" />
      <Button label="Unblock" severity="secondary" @click="blocked = false" />
    </div>
    <BlockUI :blocked="blocked">
      <Panel header="Blockable panel">
        <p class="m-0">Click Block to overlay this panel, Unblock to release it.</p>
      </Panel>
    </BlockUI>
  </div>
</template>

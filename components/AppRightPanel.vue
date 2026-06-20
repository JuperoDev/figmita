<script setup>
import { watch } from 'vue'

const { rightTab } = useRightPanel()
const { selectedEl, selectedSub, activeElement } = useElements()
const { activeScreenId } = useScreens()

watch([selectedEl, selectedSub, activeScreenId], () => {
  if (selectedSub.value === 'btn')  rightTab.value = 'interactions'
  else if (selectedEl.value)        rightTab.value = 'design'
  else                              rightTab.value = 'screen'
})
</script>

<template>
  <aside class="side-panel right-panel">

    <!-- Screen tab -->
    <template v-if="rightTab === 'screen'">
      <PanelScreenTab />
    </template>

    <!-- Element tabs (Design / Content / JSON) -->
    <template v-else-if="rightTab === 'design' || rightTab === 'content' || rightTab === 'json'">
      <div class="panel-tabs">
        <button :class="['ptab', rightTab === 'design'  && 'active']" @click="rightTab = 'design'">Design</button>
        <button :class="['ptab', rightTab === 'content' && 'active']" @click="rightTab = 'content'">Content</button>
        <button :class="['ptab', rightTab === 'json'    && 'active']" @click="rightTab = 'json'">JSON</button>
      </div>
      <PanelDesignTab  v-if="rightTab === 'design'" />
      <PanelContentTab v-if="rightTab === 'content'" />
      <PanelJsonTab    v-if="rightTab === 'json'" />
    </template>

    <!-- Interactions tab -->
    <template v-else-if="rightTab === 'interactions' && activeElement">
      <div class="panel-tabs">
        <button class="ptab active">Interactions</button>
      </div>
      <PanelInteractionsTab />
    </template>

    <!-- Nothing selected -->
    <template v-else>
      <div class="empty-select">
        <i class="pi pi-mouse-pointer" style="font-size:1.5rem;opacity:.2;" />
        <p>Select a layer</p>
      </div>
    </template>

  </aside>
</template>

<style scoped>
.side-panel { width:240px; background:#252525; display:flex; flex-direction:column; flex-shrink:0; }
.right-panel { border-left:1px solid #333; overflow-y:auto; padding-bottom:20px; }
.panel-tabs { display:flex; border-bottom:1px solid #333; flex-shrink:0; }
.ptab { flex:1; padding:8px 0; background:transparent; border:none; color:#777; cursor:pointer; font-size:12px; border-bottom:2px solid transparent; margin-bottom:-1px; }
.ptab.active { color:#f0f0f0; border-bottom-color:#7c5cfc; }
.empty-select { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:48px 20px; color:#555; font-size:12px; text-align:center; }
</style>

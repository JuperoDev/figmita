<script setup>
import { watch, computed } from 'vue'

const { rightTab } = useRightPanel()
const { selectedEl, selectedSub, activeElement } = useElements()
const { activeScreenId } = useScreens()

// Card's button is reached via the 'btn' sub-selection and gets an
// Interactions-only panel. A standalone Button element IS the interactive
// thing, so it gets a full Design/Content/Interactions/JSON tab set instead.
const hasOwnInteractions = computed(() => activeElement.value?.type === 'button')

watch([selectedEl, selectedSub, activeScreenId], () => {
  if (selectedSub.value === 'btn')  rightTab.value = 'interactions'
  else if (activeElement.value?.type === 'prime') rightTab.value = 'props'
  else if (selectedEl.value)        rightTab.value = hasOwnInteractions.value ? 'interactions' : 'design'
  else                              rightTab.value = 'screen'
})
</script>

<template>
  <aside class="side-panel right-panel">

    <!-- Screen tab -->
    <template v-if="rightTab === 'screen'">
      <PanelScreenTab />
    </template>

    <!-- Card's button sub-selection: Interactions only -->
    <template v-else-if="selectedSub === 'btn'">
      <div class="panel-tabs">
        <button class="ptab active">Interactions</button>
      </div>
      <PanelInteractionsTab />
    </template>

    <!-- PrimeVue catalog element: auto-generated Props editor + JSON -->
    <template v-else-if="activeElement?.type === 'prime'">
      <div class="panel-tabs">
        <button :class="['ptab', rightTab === 'props' && 'active']" @click="rightTab = 'props'">Props</button>
        <button :class="['ptab', rightTab === 'json'  && 'active']" @click="rightTab = 'json'">JSON</button>
      </div>
      <PanelPropsTab v-if="rightTab === 'props'" />
      <PanelJsonTab  v-if="rightTab === 'json'" />
    </template>

    <!-- Top-level element tabs (Design / Content / Interactions / JSON) -->
    <template v-else-if="activeElement">
      <div class="panel-tabs">
        <button :class="['ptab', rightTab === 'design'  && 'active']" @click="rightTab = 'design'">Design</button>
        <button :class="['ptab', rightTab === 'content' && 'active']" @click="rightTab = 'content'">Content</button>
        <button v-if="hasOwnInteractions" :class="['ptab', rightTab === 'interactions' && 'active']" @click="rightTab = 'interactions'">Interactions</button>
        <button :class="['ptab', rightTab === 'json'    && 'active']" @click="rightTab = 'json'">JSON</button>
      </div>
      <PanelDesignTab       v-if="rightTab === 'design'" />
      <PanelContentTab      v-if="rightTab === 'content'" />
      <PanelInteractionsTab v-if="rightTab === 'interactions'" />
      <PanelJsonTab         v-if="rightTab === 'json'" />
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

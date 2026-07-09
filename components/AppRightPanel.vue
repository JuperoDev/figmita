<script setup>
import { watch, computed } from 'vue'

const { rightTab } = useRightPanel()
const { selectedEl, selectedSub, activeElement, multiSel, groupSelection, ungroup } = useElements()
const { activeScreenId } = useScreens()

const multiCount = computed(() =>
  multiSel.value.ids.length > 1 ? multiSel.value.ids.length : 0)

// Card's button is reached via the 'btn' sub-selection and gets an
// Interactions-only panel. A standalone Button element IS the interactive
// thing, so it gets a full Design/Content/Interactions/JSON tab set instead.
const hasOwnInteractions = computed(() => activeElement.value?.type === 'button')

watch([selectedEl, selectedSub, activeScreenId], () => {
  if (selectedSub.value === 'btn')  rightTab.value = 'interactions'
  else if (activeElement.value?.type === 'prime') rightTab.value = 'props'
  else if (['box', 'text'].includes(activeElement.value?.type)) rightTab.value = 'design'
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

    <!-- Multi-selection: offer grouping -->
    <template v-else-if="multiCount">
      <div class="multi-panel">
        <p class="multi-count">{{ multiCount }} elements selected</p>
        <button class="group-btn" @click="groupSelection">
          <i class="pi pi-objects-column" /> Group selection
        </button>
        <p class="multi-hint">Shift-click to add or remove elements. <kbd>Ctrl</kbd>+<kbd>G</kbd> groups.</p>
      </div>
    </template>

    <!-- Group element -->
    <template v-else-if="activeElement?.type === 'group'">
      <div class="panel-tabs">
        <button class="ptab active">Group</button>
      </div>
      <p class="prop-section" style="margin-top:12px;">{{ activeElement.name }}</p>
      <div class="multi-panel">
        <p class="multi-hint" style="margin-top:0;">
          {{ activeElement.children.length }} elements move together. Ungroup to edit them individually.
        </p>
        <button class="group-btn" @click="ungroup(selectedEl.screenId, selectedEl.elId)">
          <i class="pi pi-clone" /> Ungroup
        </button>
      </div>
    </template>

    <!-- Custom library element -->
    <template v-else-if="activeElement?.type === 'custom'">
      <div class="panel-tabs">
        <button :class="['ptab', rightTab === 'interactions' && 'active']" @click="rightTab = 'interactions'">Interact</button>
        <button :class="['ptab', rightTab === 'json' && 'active']" @click="rightTab = 'json'">JSON</button>
      </div>
      <PanelInteractionsTab v-if="rightTab === 'interactions'" />
      <PanelJsonTab         v-if="rightTab === 'json'" />
      <p class="multi-hint" style="padding:10px 12px;">
        Edit this component's template and CSS in the <b>Assets</b> tab of the left panel.
      </p>
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
        <button :class="['ptab', rightTab === 'tokens' && 'active']" @click="rightTab = 'tokens'">CSS</button>
        <button :class="['ptab', rightTab === 'interactions' && 'active']" @click="rightTab = 'interactions'">Interact</button>
        <button :class="['ptab', rightTab === 'json'  && 'active']" @click="rightTab = 'json'">JSON</button>
      </div>
      <PanelPropsTab        v-if="rightTab === 'props'" />
      <PanelTokensTab       v-if="rightTab === 'tokens'" />
      <PanelInteractionsTab v-if="rightTab === 'interactions'" />
      <PanelJsonTab         v-if="rightTab === 'json'" />
    </template>

    <!-- Box / Text elements: Design / Interact / JSON -->
    <template v-else-if="['box', 'text'].includes(activeElement?.type)">
      <div class="panel-tabs">
        <button :class="['ptab', rightTab === 'design' && 'active']" @click="rightTab = 'design'">Design</button>
        <button :class="['ptab', rightTab === 'interactions' && 'active']" @click="rightTab = 'interactions'">Interact</button>
        <button :class="['ptab', rightTab === 'json'  && 'active']" @click="rightTab = 'json'">JSON</button>
      </div>
      <PanelBoxTab          v-if="rightTab === 'design' && activeElement.type === 'box'" />
      <PanelTextTab         v-if="rightTab === 'design' && activeElement.type === 'text'" />
      <PanelInteractionsTab v-if="rightTab === 'interactions'" />
      <PanelJsonTab         v-if="rightTab === 'json'" />
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
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.multi-panel { padding:14px 12px; }
.multi-count { font-size:13px; color:#eee; font-weight:600; margin:0 0 10px; }
.multi-hint { font-size:11px; color:#666; line-height:1.6; margin:10px 0 0; }
.multi-hint kbd { background:#333; border:1px solid #444; border-radius:3px; padding:0 4px; font-size:10px; font-family:monospace; color:#ccc; }
.multi-hint b { color:#aaa; }
.group-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:9px 0; background:#7c5cfc; color:white; border:none; border-radius:7px; font-size:13px; font-weight:500; cursor:pointer; font-family:inherit; transition:background .15s; }
.group-btn:hover { background:#6d4fe0; }
</style>

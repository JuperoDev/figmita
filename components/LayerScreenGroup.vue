<script setup>
import { nextTick } from 'vue'

const props = defineProps({
  sc:      { type: Object,  required: true },
  idx:     { type: Number,  required: true },
  isLast:  { type: Boolean, default: false },
})

const { screens, activeScreenId, startScreenId, renamingId, deleteScreen } = useScreens()
const { selectedEl, selectedSub, isElSel, isSubSel, clearSelection, clickEl, clickSub, deleteEl } = useElements()
const { panToIdx } = useCanvas()

const vFocus = { mounted: el => nextTick(() => el.focus()) }

const EL_ICON = { megamenu: 'pi-bars', confirmdialog: 'pi-shield', button: 'pi-mouse', prime: 'pi-prime' }
const EL_NAME = { megamenu: 'Mega Menu', confirmdialog: 'Confirm Dialog', button: 'Button' }

function setActiveScreen(id) {
  activeScreenId.value = id
  clearSelection()
  nextTick(() => panToIdx(props.idx))
}
</script>

<template>
  <div class="screen-group">
    <!-- Screen row -->
    <div
      class="layer-row"
      :class="{ selected: activeScreenId === sc.id && !selectedEl }"
      @click="setActiveScreen(sc.id)"
    >
      <i class="pi pi-chevron-right expand-ico" :class="{ expanded: activeScreenId === sc.id }" />
      <i class="pi pi-stop layer-ico frame-ico" />

      <span v-if="renamingId !== sc.id" class="layer-name" @dblclick.stop="renamingId = sc.id">
        {{ sc.name }}
      </span>
      <input
        v-else
        v-focus
        class="rename-input"
        :value="sc.name"
        @blur="e => { sc.name = e.target.value.trim() || sc.name; renamingId = null }"
        @keydown.enter="e => { sc.name = e.target.value.trim() || sc.name; renamingId = null }"
        @keydown.escape="renamingId = null"
        @click.stop
      />

      <button
        class="start-flag"
        :class="{ 'is-start': sc.id === startScreenId }"
        :title="sc.id === startScreenId ? 'Entry screen' : 'Set as entry screen'"
        @click.stop="startScreenId = sc.id"
      >
        <i class="pi pi-play-circle" />
      </button>
      <button v-if="screens.length > 1" class="layer-del" @click.stop="deleteScreen(sc.id)">
        <i class="pi pi-times" />
      </button>
    </div>

    <!-- Elements of active screen -->
    <template v-if="activeScreenId === sc.id">
      <div v-if="sc.elements.length === 0" class="layer-empty">No elements yet</div>

      <template v-for="el in sc.elements" :key="el.id">
        <div
          class="layer-row child"
          :class="{ selected: isElSel(sc.id, el.id) && !selectedSub }"
          @click="clickEl(sc.id, el.id)"
        >
          <i :class="['pi', EL_ICON[el.type] ?? 'pi-id-card', 'layer-ico', 'component-ico']" />
          <span class="layer-name">{{ el.name || EL_NAME[el.type] || 'Card' }}</span>
          <button class="layer-del" @click.stop="deleteEl(sc.id, el.id)">
            <i class="pi pi-times" />
          </button>
        </div>

        <div
          v-if="el.type === 'card'"
          class="layer-row child child2"
          :class="{ selected: isSubSel(sc.id, el.id) }"
          @click="clickSub(sc.id, el.id)"
        >
          <i class="pi pi-stop-circle layer-ico interact-ico" />
          <span class="layer-name">{{ el.config.primaryBtn }}</span>
          <span class="ia-badge">{{ el.interaction.action }}</span>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.screen-group {}
.layer-row { display:flex; align-items:center; gap:6px; padding:5px 10px; border-radius:4px; margin:1px 4px; cursor:pointer; color:#ccc; }
.layer-row:hover { background:#2e2e2e; }
.layer-row.selected { background:#3d3075; color:#fff; }
.layer-row.child  { padding-left:24px; position:relative; }
.layer-row.child2 { padding-left:38px; }
.layer-row.child::before  { content:''; position:absolute; left:14px; top:50%; width:6px; height:1px; background:#555; }
.layer-row.child2::before { content:''; position:absolute; left:28px; top:50%; width:6px; height:1px; background:#555; }
.expand-ico { font-size:9px; color:#555; flex-shrink:0; transition:transform .15s; }
.expand-ico.expanded { transform:rotate(90deg); color:#888; }
.layer-ico { font-size:11px; flex-shrink:0; }
.frame-ico     { color:#a78bfa; }
.component-ico { color:#34d399; }
.interact-ico  { color:#fb923c; }
.layer-name { flex:1; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
.layer-empty { padding:5px 24px; font-size:11px; color:#444; font-style:italic; }
.layer-del { width:18px; height:18px; display:flex; align-items:center; justify-content:center; background:transparent; border:none; color:#555; cursor:pointer; border-radius:3px; flex-shrink:0; font-size:9px; }
.layer-del:hover { background:#3a1e1e; color:#f87171; }
.rename-input { flex:1; background:#1a1a1a; border:1px solid #7c5cfc; border-radius:3px; color:#f0f0f0; font-size:12px; padding:2px 5px; outline:none; font-family:inherit; user-select:text; min-width:0; }
.ia-badge { font-size:9px; background:rgba(251,146,60,.12); color:#fb923c; border:1px solid rgba(251,146,60,.25); border-radius:3px; padding:1px 5px; white-space:nowrap; flex-shrink:0; }
.start-flag { width:18px; height:18px; display:flex; align-items:center; justify-content:center; background:transparent; border:none; color:#444; cursor:pointer; border-radius:3px; flex-shrink:0; font-size:11px; opacity:0; transition:all .15s; }
.layer-row:hover .start-flag { opacity:1; }
.start-flag.is-start { opacity:1 !important; color:#4ade80; }
.start-flag:hover { color:#a78bfa; }
</style>

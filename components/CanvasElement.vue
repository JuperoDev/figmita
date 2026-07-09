<script setup>
import { computed } from 'vue'

const props = defineProps({
  sc: { type: Object, required: true },
  el: { type: Object, required: true },
})

const { isElSel, isSubSel, isMultiSel, clickSub, clickEl } = useElements()
const { isDraggingEl, dragElId, onElMouseDown, onElResizeMouseDown } = useCanvas()
const { rightTab } = useRightPanel()

// Pencil: select the element and jump straight to its editor in the panel
function editEl() {
  clickEl(props.sc.id, props.el.id)
  rightTab.value = props.el.type === 'prime' ? 'props'
    : ['box', 'text', 'image', 'shape', 'draw'].includes(props.el.type) ? 'design'
    : 'content'
}

// Boxes, images, and shapes are freely resizable via their selection handles
const resizable = computed(() => ['box', 'image', 'shape'].includes(props.el.type))
const HANDLE_EDGES = { tl: 'tl', tr: 'tr', bl: 'bl', br: 'br', tm: 't', bm: 'b', ml: 'l', mr: 'r' }
const HANDLE_CURSOR = {
  tl: 'nwse-resize', br: 'nwse-resize', tr: 'nesw-resize', bl: 'nesw-resize',
  tm: 'ns-resize', bm: 'ns-resize', ml: 'ew-resize', mr: 'ew-resize',
}
</script>

<template>
  <div
    class="el-anchor"
    :class="{
      'el-sel':    isElSel(sc.id, el.id),
      'sub-sel':   isSubSel(sc.id, el.id),
      'multi-sel': isMultiSel(sc.id, el.id),
    }"
    :style="{
      left:   el.pos.x + 'px',
      top:    el.pos.y + 'px',
      cursor: isDraggingEl && dragElId === el.id ? 'grabbing' : 'grab',
    }"
    @mousedown="onElMouseDown($event, sc.id, el.id)"
  >
    <template v-if="isElSel(sc.id, el.id) || isSubSel(sc.id, el.id)">
      <span
        v-for="(edges, h) in HANDLE_EDGES" :key="h"
        class="handle" :class="[h, { grabby: resizable }]"
        :style="resizable ? { cursor: HANDLE_CURSOR[h] } : null"
        @mousedown="resizable && onElResizeMouseDown($event, sc.id, el.id, edges)"
      />
    </template>

    <ElementsCardMock
      v-if="el.type === 'card'"
      :config="el.config"
      :play-mode="false"
      :btn-selected="isSubSel(sc.id, el.id)"
      @select-btn="clickSub(sc.id, el.id)"
      @btn-click="() => {}"
    />

    <ElementsMegaMenuMock
      v-else-if="el.type === 'megamenu'"
      :config="el.config"
    />

    <ElementsConfirmDialogMock
      v-else-if="el.type === 'confirmdialog'"
      :config="el.config"
    />

    <ElementsButtonMock
      v-else-if="el.type === 'button'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsPrimeMock
      v-else-if="el.type === 'prime'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsBoxMock
      v-else-if="el.type === 'box'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsTextMock
      v-else-if="el.type === 'text'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsImageMock
      v-else-if="el.type === 'image'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsShapeMock
      v-else-if="el.type === 'shape'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsDrawMock
      v-else-if="el.type === 'draw'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsCustomMock
      v-else-if="el.type === 'custom'"
      :config="el.config"
      :play-mode="false"
    />

    <ElementsAnyMock
      v-else-if="el.type === 'group'"
      :el="el"
      :play-mode="false"
      class="group-mock"
    />

    <button class="el-pencil" title="Edit" @mousedown.stop @click.stop="editEl">
      <i class="pi pi-pencil" />
    </button>
  </div>
</template>

<style scoped>
.el-anchor { position:absolute; }
.el-anchor.el-sel  :deep(.p-card) { outline:2px solid #7c5cfc; outline-offset:2px; }
.el-anchor.sub-sel :deep(.p-card) { outline:2px solid #7c5cfc; outline-offset:2px; }
.el-anchor.el-sel  :deep(.p-megamenu) { outline:2px dashed #ef4444; outline-offset:4px; }
.el-anchor.el-sel  :deep(.confirm-mock) { outline:2px dashed #ef4444; outline-offset:4px; }
.el-anchor.el-sel  :deep(.button-mock .p-button) { outline:2px solid #7c5cfc; outline-offset:2px; }
.el-anchor.el-sel  :deep(.prime-mock) { outline:2px solid #7c5cfc; outline-offset:4px; border-radius:2px; }
.el-pencil {
  position:absolute; top:-30px; right:0;
  display:flex; align-items:center; justify-content:center;
  width:24px; height:24px; border-radius:6px;
  background:#7c5cfc; border:none; color:white; font-size:11px;
  cursor:pointer; opacity:0; pointer-events:none;
  transition:opacity .12s, background .12s; z-index:20;
}
.el-anchor:hover .el-pencil, .el-anchor.el-sel .el-pencil { opacity:1; pointer-events:auto; }
.el-pencil:hover { background:#6d4fe0; }
.el-anchor.el-sel  :deep(.box-mock) { outline:2px solid #7c5cfc; outline-offset:2px; }
.el-anchor.el-sel  :deep(.image-mock), .el-anchor.el-sel :deep(.shape-mock), .el-anchor.el-sel :deep(.draw-mock) { outline:2px solid #7c5cfc; outline-offset:2px; }
.el-anchor.el-sel  :deep(.text-mock) { outline:2px solid #7c5cfc; outline-offset:4px; border-radius:2px; }
.el-anchor.el-sel  :deep(.custom-mock) { outline:2px solid #7c5cfc; outline-offset:4px; border-radius:2px; }
.el-anchor.el-sel  > .group-mock { outline:2px dashed #f59e0b; outline-offset:6px; border-radius:2px; }
.el-anchor.multi-sel > * { outline:2px dashed #38bdf8 !important; outline-offset:3px; border-radius:2px; }
.handle { position:absolute; width:8px; height:8px; background:white; border:2px solid #7c5cfc; border-radius:1px; z-index:10; pointer-events:none; transform:translate(-50%,-50%); }
.handle.grabby { pointer-events:auto; }
.handle.tl{top:0;left:0}    .handle.tr{top:0;left:100%}
.handle.bl{top:100%;left:0} .handle.br{top:100%;left:100%}
.handle.tm{top:0;left:50%}  .handle.bm{top:100%;left:50%}
.handle.ml{top:50%;left:0}  .handle.mr{top:50%;left:100%}
</style>

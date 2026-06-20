<script setup>
const props = defineProps({
  sc: { type: Object, required: true },
  el: { type: Object, required: true },
})

const { isElSel, isSubSel, clickSub } = useElements()
const { isDraggingEl, dragElId, onElMouseDown } = useCanvas()
</script>

<template>
  <div
    class="el-anchor"
    :class="{
      'el-sel':  isElSel(sc.id, el.id),
      'sub-sel': isSubSel(sc.id, el.id),
    }"
    :style="{
      left:   el.pos.x + 'px',
      top:    el.pos.y + 'px',
      cursor: isDraggingEl && dragElId === el.id ? 'grabbing' : 'grab',
    }"
    @mousedown="onElMouseDown($event, sc.id, el.id)"
  >
    <template v-if="isElSel(sc.id, el.id) || isSubSel(sc.id, el.id)">
      <span class="handle tl"/><span class="handle tr"/>
      <span class="handle bl"/><span class="handle br"/>
      <span class="handle tm"/><span class="handle bm"/>
      <span class="handle ml"/><span class="handle mr"/>
    </template>

    <CardMock
      v-if="el.type === 'card'"
      :config="el.config"
      :play-mode="false"
      :btn-selected="isSubSel(sc.id, el.id)"
      @select-btn="clickSub(sc.id, el.id)"
      @btn-click="() => {}"
    />
  </div>
</template>

<style scoped>
.el-anchor { position:absolute; }
.el-anchor.el-sel  :deep(.p-card) { outline:2px solid #7c5cfc; outline-offset:2px; }
.el-anchor.sub-sel :deep(.p-card) { outline:2px solid #7c5cfc; outline-offset:2px; }
.handle { position:absolute; width:8px; height:8px; background:white; border:2px solid #7c5cfc; border-radius:1px; z-index:10; pointer-events:none; transform:translate(-50%,-50%); }
.handle.tl{top:0;left:0}    .handle.tr{top:0;left:100%}
.handle.bl{top:100%;left:0} .handle.br{top:100%;left:100%}
.handle.tm{top:0;left:50%}  .handle.bm{top:100%;left:50%}
.handle.ml{top:50%;left:0}  .handle.mr{top:50%;left:100%}
</style>

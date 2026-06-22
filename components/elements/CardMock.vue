<script setup>
import { computed } from 'vue'

const props = defineProps({
  config:      { type: Object,  required: true },
  playMode:    { type: Boolean, default: false },
  btnSelected: { type: Boolean, default: false },
})

const emit = defineEmits(['select-btn', 'btn-click'])

const heroStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.config.heroFrom} 0%, ${props.config.heroTo} 100%)`,
}))
</script>

<template>
  <Card style="width:360px; overflow:hidden;">
    <template #header>
      <div class="hero">
        <div class="hero-bg" :style="heroStyle" />
        <i :class="['pi', config.heroIcon, 'hero-ico']" />
      </div>
    </template>
    <template #title>
      <div class="title-row">
        <span v-if="config.title" class="title-text">{{ config.title }}</span>
        <span v-else class="placeholder">Title</span>
        <Tag v-if="config.badgeLabel" :value="config.badgeLabel" :severity="config.badgeSeverity" rounded />
      </div>
    </template>
    <template v-if="config.subtitle" #subtitle>{{ config.subtitle }}</template>
    <template #content>
      <p v-if="config.description" class="desc">{{ config.description }}</p>
      <div v-if="config.price" class="price-row">
        <span class="price">{{ config.price }}</span>
        <span v-if="config.period" class="period">{{ config.period }}</span>
      </div>
      <ul v-if="config.features?.length" class="features">
        <li v-for="f in config.features" :key="f">
          <i class="pi pi-check chk" />{{ f }}
        </li>
      </ul>
    </template>
    <template #footer>
      <div class="footer">
        <div class="btn-wrap" :class="{ 'btn-sel': btnSelected }">
          <div v-if="!playMode" class="capture" @mousedown.stop="emit('select-btn')" />
          <Button :label="config.primaryBtn" icon="pi pi-arrow-right" iconPos="right" style="width:100%;" @click="emit('btn-click')" />
        </div>
        <Button icon="pi pi-bookmark" severity="secondary" outlined />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.hero { position:relative; height:180px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.hero-bg { position:absolute; inset:0; }
.hero-ico { position:relative; z-index:1; font-size:3rem; color:white; opacity:.9; }
.title-row { display:flex; align-items:center; justify-content:space-between; }
.title-text { font-weight: 600; }
.placeholder { color: #d1d5db; font-style: italic; font-weight: 400; }
.desc { font-size:13px; color:#6b7280; line-height:1.6; margin:0; }
.price-row { display:flex; align-items:baseline; gap:4px; margin-top:14px; }
.price { font-size:2rem; font-weight:700; color:#111827; }
.period { font-size:13px; color:#9ca3af; }
.features { list-style:none; padding:0; margin:12px 0 0; display:flex; flex-direction:column; gap:7px; font-size:13px; color:#4b5563; }
.features li { display:flex; align-items:center; gap:8px; }
.chk { color:#34d399; font-size:11px; }
.footer { display:flex; gap:8px; }
.btn-wrap { flex:1; position:relative; }
.capture { position:absolute; inset:0; z-index:5; cursor:default; border-radius:6px; }
.capture:hover { background:rgba(124,92,252,.08); }
.btn-sel :deep(.p-button) { outline:2px solid #7c5cfc !important; outline-offset:2px; }
</style>

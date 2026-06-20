<script setup>
const { fakeAlert, closeAlert } = usePlayMode()
</script>

<template>
  <Transition name="alert-pop">
    <div v-if="fakeAlert.visible" class="fake-alert-overlay" @click.self="closeAlert">
      <div class="fake-alert">
        <div class="alert-header">
          <div class="dot red" /><div class="dot yellow" /><div class="dot green" />
          <span class="alert-origin">figmita says</span>
        </div>
        <div class="alert-body">
          <p class="alert-text">{{ fakeAlert.text }}</p>
        </div>
        <div class="alert-footer">
          <button class="alert-ok" @click="closeAlert">OK</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fake-alert-overlay { position:absolute; inset:0; z-index:100; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px); }
.fake-alert { background:#f5f5f7; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,.4); width:280px; overflow:hidden; font-family:-apple-system,'SF Pro Text',system-ui,sans-serif; }
.alert-header { background:#e8e8ed; padding:10px 14px; display:flex; align-items:center; gap:6px; border-bottom:1px solid #d1d1d6; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot.red    { background:#ff5f57; }
.dot.yellow { background:#febc2e; }
.dot.green  { background:#28c840; }
.alert-origin { font-size:12px; color:#6b6b6b; margin-left:6px; flex:1; text-align:center; }
.alert-body { padding:20px 20px 14px; }
.alert-text { font-size:14px; color:#1c1c1e; line-height:1.5; margin:0; white-space:pre-wrap; word-break:break-word; }
.alert-footer { padding:0 16px 14px; display:flex; justify-content:flex-end; }
.alert-ok { background:#007aff; color:white; border:none; border-radius:7px; padding:7px 22px; font-size:14px; font-weight:500; cursor:pointer; font-family:inherit; }
.alert-ok:hover { background:#0062cc; }
.alert-pop-enter-active { transition:all .2s cubic-bezier(.34,1.56,.64,1); }
.alert-pop-leave-active { transition:all .15s ease; }
.alert-pop-enter-from,.alert-pop-leave-to { opacity:0; }
.alert-pop-enter-from :deep(.fake-alert) { transform:scale(.8); }
.alert-pop-leave-to   :deep(.fake-alert) { transform:scale(.95); }
</style>

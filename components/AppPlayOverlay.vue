<script setup>
import { SCREEN_W, SCREEN_H } from '~/composables/useConstants.js'

const { playMode, playScreenId, playScreen, playScale, transitionDir, handlePlayBtn, goTo, confirmOverlay } = usePlayMode()
const { screens } = useScreens()
</script>

<template>
  <Teleport to="body">
    <Transition name="play-overlay">
      <div v-if="playMode" class="play-overlay">

        <div class="play-toolbar">
          <div class="pt-logo">F</div>
          <div class="pt-screens">
            <button
              v-for="sc in screens"
              :key="sc.id"
              class="pt-pill"
              :class="{ active: sc.id === playScreenId }"
              @click="goTo(sc.id)"
            >{{ sc.name }}</button>
          </div>
          <button class="pt-exit" @click="playMode = false">
            <i class="pi pi-times" /> Esc
          </button>
        </div>

        <div class="play-viewport">
          <div class="play-scaler" :style="{ transform: `scale(${playScale})`, transformOrigin: 'center center' }">
            <Transition :name="`slide-${transitionDir}`" mode="out-in">
              <div
                :key="playScreenId"
                class="play-screen"
                :style="{ width: SCREEN_W + 'px', height: SCREEN_H + 'px' }"
              >
                <div
                  class="play-screen-scroll"
                  :style="{ overflowY: confirmOverlay.visible && confirmOverlay.blockScroll ? 'hidden' : 'auto' }"
                >
                  <div
                    class="play-screen-content"
                    :style="{ width: SCREEN_W + 'px', height: (playScreen.height ?? SCREEN_H) + 'px', background: playScreen.bg }"
                  >
                    <div v-if="playScreen.elements.length === 0" class="play-empty">
                      <i class="pi pi-layout" style="font-size:2rem;opacity:.3;" />
                      <p>This screen has no elements</p>
                    </div>

                    <div
                      v-for="el in playScreen.elements"
                      :key="el.id"
                      :style="{ position: 'absolute', left: el.pos.x + 'px', top: el.pos.y + 'px' }"
                    >
                      <ElementsCardMock
                        v-if="el.type === 'card'"
                        :config="el.config"
                        :play-mode="true"
                        @btn-click="handlePlayBtn(el)"
                      />
                      <ElementsMegaMenuMock
                        v-else-if="el.type === 'megamenu'"
                        :config="el.config"
                      />
                      <ElementsButtonMock
                        v-else-if="el.type === 'button'"
                        :config="el.config"
                        :play-mode="true"
                        @click="handlePlayBtn(el)"
                      />
                    </div>
                  </div>
                </div>

                <FakeAlert />
                <ConfirmOverlay />
              </div>
            </Transition>
          </div>
        </div>

        <div class="play-dots">
          <span
            v-for="sc in screens"
            :key="sc.id"
            class="play-dot"
            :class="{ active: sc.id === playScreenId }"
            @click="goTo(sc.id)"
          />
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.play-overlay { position:fixed; inset:0; z-index:1000; background:#0a0a0a; display:flex; flex-direction:column; }
.play-overlay-enter-active,.play-overlay-leave-active { transition:opacity .2s; }
.play-overlay-enter-from,.play-overlay-leave-to { opacity:0; }
.play-toolbar { display:flex; align-items:center; height:48px; padding:0 16px; background:#141414; border-bottom:1px solid #222; flex-shrink:0; gap:12px; }
.pt-logo { width:26px; height:26px; background:linear-gradient(135deg,#7c5cfc,#a78bfa); border-radius:5px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; color:white; flex-shrink:0; }
.pt-screens { display:flex; align-items:center; gap:6px; flex:1; overflow-x:auto; }
.pt-pill { padding:4px 12px; background:#1e1e1e; border:1px solid #2e2e2e; border-radius:20px; color:#888; font-size:12px; cursor:pointer; white-space:nowrap; transition:all .15s; font-family:inherit; }
.pt-pill:hover { border-color:#555; color:#ccc; }
.pt-pill.active { background:#3d3075; border-color:#7c5cfc; color:#f0f0f0; }
.pt-exit { display:flex; align-items:center; gap:6px; padding:5px 14px; background:transparent; border:1px solid #333; border-radius:6px; color:#888; font-size:12px; cursor:pointer; font-family:inherit; transition:all .15s; }
.pt-exit:hover { border-color:#888; color:#f0f0f0; }
.play-viewport { flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.play-scaler { position:relative; }
.play-screen { position:relative; overflow:hidden; box-shadow:0 0 0 1px rgba(255,255,255,.08), 0 40px 120px rgba(0,0,0,.8); }
.play-screen-scroll { position:absolute; inset:0; overflow-y:auto; overflow-x:hidden; }
.play-screen-content { position:relative; }
.play-empty { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:#9ca3af; font-size:14px; }
.play-dots { display:flex; justify-content:center; gap:6px; padding:12px 0; flex-shrink:0; }
.play-dot { width:6px; height:6px; border-radius:50%; background:#333; cursor:pointer; transition:all .2s; }
.play-dot.active { background:#7c5cfc; transform:scale(1.3); }
.play-dot:hover { background:#666; }
.slide-left-enter-active  { transition:transform .32s cubic-bezier(.4,0,.2,1); }
.slide-left-leave-active  { transition:transform .32s cubic-bezier(.4,0,.2,1),opacity .32s; position:absolute; top:0; left:0; }
.slide-left-enter-from    { transform:translateX(100%); }
.slide-left-leave-to      { transform:translateX(-20%); opacity:0; }
.slide-right-enter-active { transition:transform .32s cubic-bezier(.4,0,.2,1); }
.slide-right-leave-active { transition:transform .32s cubic-bezier(.4,0,.2,1),opacity .32s; position:absolute; top:0; left:0; }
.slide-right-enter-from   { transform:translateX(-100%); }
.slide-right-leave-to     { transform:translateX(20%); opacity:0; }
</style>

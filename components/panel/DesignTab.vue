<script setup>
import { SCREEN_W } from '~/composables/useConstants.js'

const { selectedEl } = useElements()
const { activeElement, deleteEl } = useElements()

const { severityOptions } = useEditor()

const COMPONENT_NAME = { megamenu: 'MegaMenu', confirmdialog: 'ConfirmDialog', button: 'Button' }
const COMPONENT_W     = { megamenu: SCREEN_W, confirmdialog: 380, button: 'auto' }
</script>

<template>
  <template v-if="activeElement">
    <p class="prop-section">Name</p>
    <div class="ce-field">
      <input class="ce-input" v-model="activeElement.name" placeholder="Layer name" />
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Layout</p>
    <div class="prop-grid">
      <div class="prop-field"><label>W</label><input class="prop-inp" :value="COMPONENT_W[activeElement.type] ?? '360'" readonly /></div>
      <div class="prop-field"><label>H</label><input class="prop-inp" value="auto" readonly /></div>
      <div class="prop-field"><label>X</label><input class="prop-inp" :value="activeElement.pos.x" readonly /></div>
      <div class="prop-field"><label>Y</label><input class="prop-inp" :value="activeElement.pos.y" readonly /></div>
    </div>

    <div class="prop-hr" />
    <p class="prop-section">Component</p>
    <div class="component-badge">
      <i class="pi pi-box" />
      <span>PrimeVue / {{ COMPONENT_NAME[activeElement.type] ?? 'Card' }}</span>
    </div>

    <template v-if="activeElement.type === 'megamenu'">
      <div class="prop-hr" />
      <p class="prop-section">PrimeVue Props</p>
      <div class="ce-field">
        <label class="ce-label">orientation</label>
        <select class="dark-select" v-model="activeElement.config.orientation">
          <option value="horizontal">horizontal</option>
          <option value="vertical">vertical</option>
        </select>
      </div>
      <div class="ce-field">
        <label class="ce-label">breakpoint</label>
        <input class="ce-input" v-model="activeElement.config.breakpoint" placeholder="960px" />
      </div>
      <div class="ce-field">
        <label class="ce-label">scrollHeight</label>
        <input class="ce-input" v-model="activeElement.config.scrollHeight" placeholder="20rem" />
      </div>
      <div class="ce-field">
        <label class="ce-label">ariaLabel</label>
        <input class="ce-input" v-model="activeElement.config.ariaLabel" placeholder="(optional)" />
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.disabled" />
          <span class="ce-label" style="margin:0;">disabled</span>
        </label>
      </div>
    </template>

    <template v-else-if="activeElement.type === 'confirmdialog'">
      <div class="prop-hr" />
      <p class="prop-section">PrimeVue Props</p>
      <div class="ce-field">
        <label class="ce-label">position</label>
        <select class="dark-select" v-model="activeElement.config.position">
          <option v-for="p in ['center','top','bottom','left','right','topleft','topright','bottomleft','bottomright']" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div class="ce-field">
        <label class="ce-label">defaultFocus</label>
        <select class="dark-select" v-model="activeElement.config.defaultFocus">
          <option value="accept">accept</option>
          <option value="reject">reject</option>
        </select>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.modal" />
          <span class="ce-label" style="margin:0;">modal</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.blockScroll" />
          <span class="ce-label" style="margin:0;">blockScroll</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.draggable" />
          <span class="ce-label" style="margin:0;">draggable</span>
        </label>
        <p class="hint-text">No effect on the canvas preview — affects the real component's behavior conceptually.</p>
      </div>
    </template>

    <template v-else-if="activeElement.type === 'button'">
      <div class="prop-hr" />
      <p class="prop-section">PrimeVue Props</p>
      <div class="ce-field">
        <label class="ce-label">severity</label>
        <select class="dark-select" v-model="activeElement.config.severity">
          <option :value="null">default (primary)</option>
          <option v-for="s in severityOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="ce-field">
        <label class="ce-label">size</label>
        <select class="dark-select" v-model="activeElement.config.size">
          <option :value="null">normal</option>
          <option value="small">small</option>
          <option value="large">large</option>
        </select>
      </div>
      <div class="ce-field">
        <label class="ce-label">iconPos</label>
        <select class="dark-select" v-model="activeElement.config.iconPos">
          <option value="left">left</option>
          <option value="right">right</option>
          <option value="top">top</option>
          <option value="bottom">bottom</option>
        </select>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.raised" />
          <span class="ce-label" style="margin:0;">raised</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.rounded" />
          <span class="ce-label" style="margin:0;">rounded</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.text" />
          <span class="ce-label" style="margin:0;">text</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.outlined" />
          <span class="ce-label" style="margin:0;">outlined</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.fluid" />
          <span class="ce-label" style="margin:0;">fluid</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.loading" />
          <span class="ce-label" style="margin:0;">loading</span>
        </label>
      </div>
      <div class="ce-field">
        <label class="ce-check-row">
          <input type="checkbox" v-model="activeElement.config.disabled" />
          <span class="ce-label" style="margin:0;">disabled</span>
        </label>
      </div>
    </template>

    <div class="prop-hr" />
    <div class="ce-field">
      <button class="danger-btn" @click="deleteEl(selectedEl.screenId, selectedEl.elId)">
        <i class="pi pi-trash" /> Delete element
      </button>
    </div>
  </template>
</template>

<style scoped>
.prop-section { font-size:10px; font-weight:600; color:#666; text-transform:uppercase; letter-spacing:.08em; padding:12px 12px 5px; margin:0; }
.prop-hr { height:1px; background:#2e2e2e; margin:10px 0; }
.prop-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:0 12px; }
.prop-field { display:flex; align-items:center; background:#1e1e1e; border:1px solid #333; border-radius:4px; overflow:hidden; }
.prop-field label { font-size:10px; color:#555; padding:0 5px; white-space:nowrap; }
.prop-inp { flex:1; background:transparent; border:none; outline:none; color:#d0d0d0; font-size:12px; padding:5px 5px 5px 0; width:0; font-variant-numeric:tabular-nums; }
.component-badge { display:flex; align-items:center; gap:8px; padding:6px 8px; margin:0 12px; background:rgba(52,211,153,.08); border:1px solid rgba(52,211,153,.25); border-radius:4px; font-size:12px; color:#34d399; }
.ce-field { padding:0 12px 8px; }
.ce-label { display:block; font-size:10px; color:#666; margin-bottom:4px; }
.hint-text { font-size:11px; color:#555; margin:4px 0 0; }
.ce-input { width:100%; box-sizing:border-box; background:#1e1e1e; border:1px solid #333; border-radius:4px; color:#d0d0d0; font-size:12px; padding:5px 8px; outline:none; font-family:inherit; user-select:text; }
.ce-input:focus { border-color:#7c5cfc; }
.dark-select { background:#1e1e1e; border:1px solid #333; color:#d0d0d0; border-radius:4px; padding:5px 8px; font-size:12px; cursor:pointer; outline:none; width:100%; user-select:text; }
.dark-select:focus { border-color:#7c5cfc; }
.ce-check-row { display:flex; align-items:center; gap:6px; cursor:pointer; }
.danger-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:8px; background:transparent; border:1px solid #5a2020; color:#f87171; border-radius:6px; cursor:pointer; font-size:12px; font-family:inherit; transition:all .15s; }
.danger-btn:hover { background:#3a1e1e; border-color:#f87171; }
</style>

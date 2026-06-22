# Adding a new PrimeVue component to figmita

This walks through every file you touch to add a new placeable element type, using the existing **Button** and **Alert** (`FakeAlert.vue`) integrations as the reference. Read [docs/ARCHITECTURE.md](./ARCHITECTURE.md) first if you haven't — this doc assumes you know the element/config model described there.

There are two shapes of "component" in figmita:

- **A canvas element** (Card, Button, MegaMenu, ConfirmDialog) — something the user drags onto a screen, selects, edits in the inspector, and that PrimeVue renders.
- **Play-mode runtime UI** (the fake alert popup, the confirm overlay) — something that only appears while simulating the prototype, triggered by an element's `interaction`, not placed directly on the canvas.

Most new components are the first kind. The steps below are for that; the Alert case is covered separately at the end since it follows a different, simpler pattern.

## Adding a new canvas element type (worked example: hypothetical `tag`)

### 1. Define the config schema — `composables/useFactories.js`

Add a `make<Type>Config()` factory returning the default prop bag — this **is** the PrimeVue component's prop list, with sane defaults:

```js
export function makeTagConfig() {
  return {
    value:    'Tag',
    severity: null,
    icon:     '',
    rounded:  false,
  }
}
```

Register it in `makeElement()`'s `config:` ternary chain, and add a friendly name to `ELEMENT_NAMES`:

```js
const ELEMENT_NAMES = { card: 'Card', megamenu: 'Mega Menu', confirmdialog: 'Confirm Dialog', button: 'Button', tag: 'Tag' }
// ...
config: type === 'card' ? makeCardConfig()
  : type === 'tag' ? makeTagConfig()
  : /* ...existing branches... */ {},
```

Only add fields the PrimeVue component actually accepts as props (or fields your Mock component derives styling from, like Button's `bgColor`). Don't invent config fields speculatively.

### 2. Build the `*Mock.vue` wrapper — `components/elements/TagMock.vue`

This is the thinnest possible wrapper around the real PrimeVue component. It takes `config` and spreads it as props; it does **not** duplicate or reinterpret PrimeVue's prop logic:

```vue
<script setup>
const props = defineProps({
  config:   { type: Object,  required: true },
  playMode: { type: Boolean, default: false },
})
</script>

<template>
  <div class="tag-mock">
    <Tag v-bind="config" :severity="config.severity || undefined" />
  </div>
</template>

<style scoped>
.tag-mock { display:inline-block; }
</style>
```

If the component needs play-mode click behavior, follow `ButtonMock.vue`: accept `playMode`, emit `click` only when `playMode` is true, and have `CanvasElement.vue` wire that emit to `usePlayMode().handlePlayBtn`.

If you need **per-instance custom colors** beyond severity presets, follow the CSS-variable-override pattern documented in `ARCHITECTURE.md` under "Per-instance PrimeVue style overrides" — look up the component's design tokens in `node_modules/@primeuix/styles/dist/<component>/index.mjs` to find the exact `--p-<component>-...` variable names.

### 3. Render it on the canvas — `components/CanvasElement.vue`

Add a branch next to the existing ones. Every component under `components/elements/` is placed in that folder specifically because it's "a PrimeVue component droppable on the canvas" — and Nuxt's path-based auto-import prefixes the tag with the folder name, so `components/elements/TagMock.vue` is used as `<ElementsTagMock>`, not `<TagMock>`:

```vue
<ElementsTagMock
  v-else-if="el.type === 'tag'"
  :config="el.config"
/>
```

(No import needed — Nuxt auto-imports everything under `components/`, it's the directory path that determines the tag name.)

### 4. Add it to the "Add Component" palette — `components/panel/ScreenTab.vue`

```vue
<button class="comp-btn" @click="addElement('tag')">
  <i class="pi pi-tag" style="font-size:1.3rem;" />
  <span>Tag</span>
</button>
```

If creation needs upfront input (like MegaMenu's items or Button's label), follow the `showButtonDialog`/`confirmAddButton` pattern instead of a bare `addElement` call.

### 5. Wire up the inspector tabs

- **`components/panel/DesignTab.vue`** — PrimeVue API props (severity, size, boolean flags, anything that's "configuring the component", not "content"). Add a `<template v-else-if="activeElement.type === 'tag'">` block, bind controls with `v-model="activeElement.config.xxx"`. Also add the type to the `COMPONENT_NAME` / `COMPONENT_W` maps near the top.
- **`components/panel/ContentTab.vue`** — text/icon/color fields (labels, descriptions, colors). Same `v-else-if` pattern. Use `<IconPicker v-model="activeElement.config.icon" />` for any icon field rather than a free-text input — it's the shared, reusable picker (see ARCHITECTURE.md's "Icon picking" section); don't write a new one-off icon input.
- **`components/panel/InteractionsTab.vue`** — only needed if the element is independently clickable (has its own `interaction`, like Button). Most non-interactive elements (Card's nested button aside) don't need changes here. If the element's primary purpose IS the interactive thing, also set `hasOwnInteractions` in `AppRightPanel.vue` to include your type so it gets its own Interactions tab.
- **`components/panel/JsonTab.vue`** — generic, dumps `activeElement` as JSON; nothing to change here.

There's no central prop-table/schema-driven form generator — every tab hand-codes its fields per `el.type`. This is intentional given the small number of element types; don't introduce a generic form-from-schema abstraction for one new type.

### 6. (Optional) Layers tree label / icon

`components/LayerScreenGroup.vue` shows each element's name and an icon in the layers list — check whether it has a type→icon map that needs a new entry.

## Play-mode-only UI (worked example: the Alert)

`FakeAlert.vue` is **not** a canvas element — there's no `makeAlertConfig()`, no entry in `makeElement()`, no palette button. It's permanently mounted (likely in `AppPlayOverlay.vue` or `pages/index.vue`) and toggled by `usePlayMode()`'s `fakeAlert` ref:

```js
const fakeAlert = ref({ visible: false, text: '' })
function closeAlert() { fakeAlert.value.visible = false; /* ...handle pendingNav... */ }
```

Any element's `interaction.action` can trigger it (`handlePlayBtn` sets `fakeAlert.value = { visible: true, text: ia.alertText }`). To add a similar one-off runtime overlay (not a confirm dialog, which already exists as `ConfirmOverlay.vue`):

1. Add a module-level `ref` for its visibility/data in `usePlayMode.js`.
2. Build the overlay component reading that ref via `usePlayMode()`, styled to match `FakeAlert.vue`'s overlay/backdrop conventions.
3. Mount it once alongside `FakeAlert.vue`/`ConfirmOverlay.vue` (check where those are currently mounted — likely `AppPlayOverlay.vue`).
4. Add a new `interaction.action` value in `useEditor.js`'s `actionOptions`, and a branch in `handlePlayBtn` to trigger it, and a corresponding options block in `InteractionsTab.vue`.

## Checklist

- [ ] `make<Type>Config()` in `useFactories.js`, registered in `makeElement()` + `ELEMENT_NAMES`
- [ ] `components/elements/<Type>Mock.vue` — thin wrapper, `v-bind="config"` onto the real PrimeVue component (used elsewhere as `<Elements<Type>Mock>`)
- [ ] Branch in `CanvasElement.vue`
- [ ] Palette button in `ScreenTab.vue` (+ creation dialog if it needs upfront input)
- [ ] `DesignTab.vue` branch for PrimeVue API props
- [ ] `ContentTab.vue` branch for content/icon/color fields (reuse `IconPicker` for icons)
- [ ] `InteractionsTab.vue` / `AppRightPanel.vue`'s `hasOwnInteractions` — only if independently clickable
- [ ] `COMPONENT_NAME` / `COMPONENT_W` entries in `DesignTab.vue`
- [ ] Layers tree icon in `LayerScreenGroup.vue`, if it has a type map

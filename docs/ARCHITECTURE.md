# figmita — Architecture

## Stack

- **Nuxt 4** (Vue 3, `<script setup>`) — no TypeScript anywhere in the app (no `.ts` files outside `.nuxt/`, no `lang="ts"`). Every file is plain JavaScript.
- **PrimeVue 4** (`@primevue/nuxt-module`) with the **Aura** theme preset, registered in `nuxt.config.js`. Components (`Button`, `Card`, `MegaMenu`, `ConfirmDialog`, `Dialog`, `Tag`, …) are auto-imported globally — you never write `import Button from 'primevue/button'`.
- **PrimeIcons** for all iconography (`pi pi-xxx` classes).
- **Pinia** is installed (`@pinia/nuxt`) but the app currently uses plain Vue composables with module-level `ref`/`computed` as its state layer (see below) rather than defined Pinia stores.
- **Tailwind CSS v4** via `@tailwindcss/vite`, used sparingly alongside hand-written scoped `<style>` blocks (most UI chrome is custom CSS, not Tailwind utility classes).
- **nuxt-security** for response headers (CSP currently disabled in config).

figmita is a Figma-style prototyping tool: you place PrimeVue components ("elements") onto "screens" on an infinite canvas, edit their props/content/interactions in a right-hand inspector, and can enter a "Play mode" that simulates clicking through the prototype.

## Directory map

```
app.vue                      — root shell, mounts the single page
pages/index.vue              — the editor page
components/
  AppTopBar.vue               — top toolbar
  AppCanvas.vue               — infinite canvas, screen rendering, pan/zoom
  CanvasScreen.vue            — one screen frame on the canvas
  CanvasElement.vue           — positions one element on a screen, dispatches to the right Mock
  CanvasArrows.vue            — draws navigation arrows between screens
  AppLeftPanel.vue            — layers tree (screens + elements)
  LayerScreenGroup.vue        — one screen's row + its elements in the layers tree
  AppRightPanel.vue           — tab router for the inspector (Screen / Design / Content / Interactions / JSON)
  panel/
    ScreenTab.vue              — screen background, entry point, "Add Component" palette
    DesignTab.vue               — PrimeVue prop editing (severity, size, layout flags…)
    ContentTab.vue              — content/text/color/icon editing
    InteractionsTab.vue         — on-click action wiring (alert / navigate / confirm)
    JsonTab.vue                  — raw JSON view of the selected element
  elements/                  — every PrimeVue component that gets dropped on the canvas, wrapped:
    CardMock.vue, ButtonMock.vue, MegaMenuMock.vue, ConfirmDialogMock.vue, ConfirmDialogCard.vue
    (Nuxt's path-based auto-import means these are used as <ElementsCardMock>, <ElementsButtonMock>, etc.)
  IconPicker.vue              — reusable PrimeIcons picker (search + grid), used by panel tabs
  FakeAlert.vue, ConfirmOverlay.vue, AppPlayOverlay.vue — Play-mode runtime UI
  ZoomHUD.vue, AppToast.vue   — misc chrome
composables/
  useConstants.js             — canvas/screen size constants
  useFactories.js              — `makeElement`, `make*Config()` factories — the schema for every element type
  useScreens.js                 — screens array, active/start screen (module-level singleton state)
  useElements.js                 — selection state + add/delete element (module-level singleton state)
  useCanvas.js                    — pan/zoom/drag interaction state
  useEditor.js                     — shared option lists (icons, severities, actions) + small editing helpers
  useRightPanel.js                  — which inspector tab is active
  usePlayMode.js                     — Play-mode runtime: navigation, alert/confirm dispatch
  usePrimeIcons.js                    — full PrimeIcons name list, backs IconPicker
  useKeyboard.js, useShare.js, useAutosave.js — keyboard shortcuts, share/export, localStorage autosave
```

## State management pattern

There is **no Pinia store in use today**, even though the package is installed. Instead, each composable in `composables/` defines its reactive state (`ref`/`computed`) **at module scope**, outside the exported function:

```js
// useScreens.js
const _home          = makeScreen('Home')
const screens         = ref([_home])
const activeScreenId  = ref(_home.id)

export function useScreens() {
  // ...returns the same refs every time it's called
  return { screens, activeScreenId, /* ... */ }
}
```

Because the `ref`s live at module level, every component that calls `useScreens()` shares the exact same reactive objects — this is a hand-rolled singleton store, not a per-component composable. This is the same trick Pinia uses internally, just without the devtools/plugin layer. **When adding new shared state, follow this pattern** (module-level state + an exported `use*()` accessor function), don't introduce a separate state mechanism (no new Pinia store, no provide/inject) unless asked.

## The element model

Every placeable thing on a screen — Card, Button, MegaMenu, ConfirmDialog — is represented uniformly as an **element**, created by `makeElement(type)` in `composables/useFactories.js`:

```js
{
  id:   'el-<uid>',
  type: 'button',                 // discriminant used everywhere to branch behavior
  name: 'Button',                 // editable layer name
  pos:  { x, y },                 // canvas position
  config: { /* type-specific PrimeVue props */ },
  interaction: {                  // on-click behavior (only meaningful for clickable elements)
    action: 'alert' | 'navigate' | 'alert+navigate' | 'confirm',
    alertText, navigateTo, confirmTarget, confirmAcceptNavigateTo,
  },
}
```

`config` is **the PrimeVue prop bag** for that element type — it's spread directly onto the real PrimeVue component via `v-bind="config"` in the corresponding `*Mock.vue` (see `ButtonMock.vue`: `<Button v-bind="config" .../>`). This is the central design decision of the whole app: **the editor doesn't reimplement PrimeVue's components, it edits the exact prop object that gets handed to them.** Each `make*Config()` factory function is the canonical schema/default-values for that element type.

Screens are the same idea, one level up (`makeScreen(name)` → `{ id, name, bg, height, elements: [] }`).

## Data flow: canvas ↔ inspector

1. `useElements().activeElement` is a `computed` that resolves the currently-selected element by walking `screens.value` using `selectedEl` (`{ screenId, elId }`).
2. The right-panel tabs (`DesignTab.vue`, `ContentTab.vue`, `InteractionsTab.vue`) bind form controls **directly** to `activeElement.config.xxx` / `activeElement.interaction.xxx` with `v-model`. There is no intermediate edit buffer, no "save" step — typing in the panel mutates the live element object immediately.
3. `CanvasElement.vue` renders whichever `*Mock.vue` matches `el.type`, passing `:config="el.config"` straight through. Because `config` is the same object the panel mutated, the canvas re-renders reactively with no extra plumbing.
4. `usePlayMode.js` reads `interaction` off the element to decide what happens on click when simulating the prototype (show a fake alert, navigate to another screen, show a confirm dialog, or chain alert→navigate).
5. `useAutosave.js` watches the screens state and persists it to `localStorage` so reloading the page doesn't lose work.

## Per-instance PrimeVue style overrides (Button color customization)

PrimeVue 4's Aura theme exposes every visual value as a CSS custom property scoped by the `severity` design token, e.g. for a button with no severity (default = `primary`):

```
--p-button-primary-background
--p-button-primary-color
--p-button-primary-border-color
--p-button-primary-hover-background
--p-button-primary-hover-color
--p-button-primary-hover-border-color
```

(swap `primary` for `success` / `info` / `warn` / `danger` / `secondary` / `contrast` when that severity is selected). These variables are normally only defined at the theme's root scope, but because CSS custom properties **inherit down the DOM tree**, setting them again on a closer ancestor wins for everything underneath — no `!important`, no fighting PrimeVue's own stylesheet.

`ButtonMock.vue` uses this to implement per-button custom colors: it computes an inline `:style` object on its own wrapper `<div>` that only sets the variables for the *currently active severity key*, and only when the user actually picked a custom color (otherwise the var is omitted and the theme default cascades through untouched):

```js
const colorVars = computed(() => {
  const key = config.severity || 'primary'
  const vars = {}
  if (config.bgColor)      vars[`--p-button-${key}-background`]      = config.bgColor
  // ...border-color mirrors background, hover-* mirrors the hover fields
  return vars
})
```

This is the pattern to reuse for any future "custom color" feature on another PrimeVue component: find the component's `dt('<component>.<token>')` calls in `node_modules/@primeuix/styles/dist/<component>/index.mjs` (these compile 1:1 to `--p-<component>-<token-as-kebab-case>`), then override just those variables on a wrapper element.

## Icon picking

`composables/usePrimeIcons.js` exports the full, hardcoded list of PrimeIcons names (extracted from `primeicons/primeicons.css`). `components/IconPicker.vue` is a self-contained, reusable `v-model`-able component (search box + scrollable icon grid) built on top of that list — it knows nothing about Button/Card/etc, it just emits a full `"pi pi-xxx"` class string (or `''` for "no icon"). It's currently wired into the Button's Content tab; swapping it into Card's hero icon, ConfirmDialog's icon, or MegaMenu item icons (which currently use free-text inputs) is a drop-in replacement — see [docs/ADDING_A_COMPONENT.md](./ADDING_A_COMPONENT.md) for the integration pattern this follows.

## Play mode

`usePlayMode.js` holds its own module-level singleton state (`playMode`, `playScreenId`, `fakeAlert`, `confirmOverlay`, `pendingNav`). `startPlay()` snapshots the current `startScreenId` as the entry point and clears any inspector selection. `handlePlayBtn(el)` is the click dispatcher: it reads `el.interaction.action` and drives navigation (`goTo`) and/or shows the `FakeAlert.vue` / `ConfirmOverlay.vue` chrome. This is intentionally decoupled from the editor's own selection state so editing and "playing" never interfere with each other.

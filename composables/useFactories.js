import { SCREEN_W, SCREEN_H, CARD_W } from './useConstants.js'

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export function makeCardConfig() {
  return {
    title:         '',
    subtitle:      '',
    badgeLabel:    '',
    badgeSeverity: 'success',
    description:   '',
    price:         '',
    period:        '',
    features:      [],
    primaryBtn:    'Button',
    heroIcon:      'pi-bolt',
    heroFrom:      '#7c5cfc',
    heroTo:        '#34d399',
  }
}

export function makeMegaMenuConfig() {
  return {
    orientation:  'horizontal',
    breakpoint:   '960px',
    scrollHeight: '20rem',
    disabled:     false,
    ariaLabel:    '',
    items: [
      { label: 'Home',     icon: 'pi pi-home', columns: [] },
      {
        label: 'Products', icon: 'pi pi-box',
        columns: [
          {
            label: 'Overview',
            items: [
              { label: 'Features',  icon: 'pi pi-eye'  },
              { label: 'Pricing',   icon: 'pi pi-tag'  },
            ],
          },
          {
            label: 'Resources',
            items: [
              { label: 'Docs',      icon: 'pi pi-book'    },
              { label: 'Support',   icon: 'pi pi-headphones' },
            ],
          },
        ],
      },
      { label: 'About',    icon: 'pi pi-info-circle', columns: [] },
    ],
  }
}

export function makeConfirmDialogConfig() {
  return {
    header:      'Are you sure?',
    message:     'This action cannot be undone.',
    icon:        'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptIcon:  '',
    rejectIcon:  '',
    position:    'center',
    modal:       true,
    blockScroll: false,
    defaultFocus: 'accept',
    draggable:   true,
  }
}

export function makeButtonConfig() {
  return {
    label:          'Button',
    icon:           '',
    iconPos:        'left',
    severity:       null,
    size:           null,
    raised:         false,
    rounded:        false,
    text:           false,
    outlined:       false,
    fluid:          false,
    loading:        false,
    disabled:       false,
    badge:          '',
    badgeSeverity:  null,
    bgColor:        '',
    textColor:      '',
    hoverBgColor:   '',
    hoverTextColor: '',
  }
}

export function makePrimeConfig() {
  return {
    component: '',
    props:     {},
    tokens:    {},
  }
}

export function makeBoxConfig() {
  return {
    w:           200,
    h:           120,
    fill:        '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    radius:      8,
    shadow:      'none',
    opacity:     100,
    text:        '',
    textColor:   '#374151',
    fontSize:    14,
    align:       'center',
  }
}

const ELEMENT_NAMES = { card: 'Card', megamenu: 'Mega Menu', confirmdialog: 'Confirm Dialog', button: 'Button', box: 'Box' }

export function makeElement(type) {
  return {
    id:   `el-${uid()}`,
    type,
    name: ELEMENT_NAMES[type] ?? 'Element',
    pos:  type === 'megamenu' ? { x: 0, y: 0 } : { x: Math.round((SCREEN_W - CARD_W) / 2), y: 160 },
    config: type === 'card' ? makeCardConfig()
      : type === 'megamenu' ? makeMegaMenuConfig()
      : type === 'confirmdialog' ? makeConfirmDialogConfig()
      : type === 'button' ? makeButtonConfig()
      : type === 'prime' ? makePrimeConfig()
      : type === 'box' ? makeBoxConfig()
      : {},
    interaction: {
      // Prime elements are often interactive by themselves (dropdowns,
      // sliders...) and boxes are usually decoration, so they start
      // with no click interaction
      action:                 type === 'prime' || type === 'box' ? 'none' : 'alert',
      alertText:              'Hello! 👋',
      navigateTo:             null,
      confirmTarget:          null,
      confirmAcceptNavigateTo: null,
    },
  }
}

export function makeScreen(name) {
  return {
    id:       `sc-${uid()}`,
    name,
    bg:       '#f3f4f6',
    height:   SCREEN_H,
    border:   { width: 0, color: '#111827' },
    shadow:   'default',
    grid:     { visible: false, cols: ['1fr', '1fr', '1fr', '1fr'], rows: ['1fr', '1fr', '1fr'], colGap: 12, rowGap: 12, color: '#7c5cfc' },
    elements: [],
  }
}

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

export function makeElement(type) {
  return {
    id:   `el-${uid()}`,
    type,
    name: type === 'card' ? 'Card' : type === 'megamenu' ? 'Mega Menu' : 'Element',
    pos:  type === 'megamenu' ? { x: 0, y: 0 } : { x: Math.round((SCREEN_W - CARD_W) / 2), y: 160 },
    config: type === 'card' ? makeCardConfig() : type === 'megamenu' ? makeMegaMenuConfig() : {},
    interaction: {
      action:     'alert',
      alertText:  'Hello! 👋',
      navigateTo: null,
    },
  }
}

export function makeScreen(name) {
  return {
    id:       `sc-${uid()}`,
    name,
    bg:       '#f3f4f6',
    height:   SCREEN_H,
    elements: [],
  }
}

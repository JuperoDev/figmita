import { SCREEN_W, CARD_W } from './useConstants.js'

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

export function makeElement(type) {
  return {
    id:   `el-${uid()}`,
    type,
    pos:  { x: Math.round((SCREEN_W - CARD_W) / 2), y: 160 },
    config: type === 'card' ? makeCardConfig() : {},
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
    elements: [],
  }
}

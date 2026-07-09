// Catalog registry: every PrimeVue component shown in /catalog.
// `name` must match both the demo file (components/catalog/demos/<name>.vue)
// and the primevue module directory (lowercased) used by the API generator.
export const categories = [
  {
    label: 'Form',
    items: ['AutoComplete', 'CascadeSelect', 'Checkbox', 'ColorPicker', 'DatePicker', 'FloatLabel',
      'IconField', 'InputGroup', 'InputMask', 'InputNumber', 'InputOtp', 'InputText', 'Knob',
      'Listbox', 'MultiSelect', 'Password', 'RadioButton', 'Rating', 'Select', 'SelectButton',
      'Slider', 'Textarea', 'ToggleButton', 'ToggleSwitch', 'TreeSelect'],
  },
  { label: 'Button', items: ['Button', 'ButtonGroup', 'SpeedDial', 'SplitButton'] },
  {
    label: 'Data',
    items: ['DataTable', 'DataView', 'OrderList', 'OrganizationChart', 'Paginator', 'PickList',
      'Timeline', 'Tree', 'TreeTable', 'VirtualScroller'],
  },
  {
    label: 'Panel',
    items: ['Accordion', 'Card', 'Divider', 'Fieldset', 'Panel', 'ScrollPanel', 'Splitter',
      'Stepper', 'Tabs', 'Toolbar'],
  },
  { label: 'Overlay', items: ['ConfirmDialog', 'ConfirmPopup', 'Dialog', 'Drawer', 'Popover', 'Tooltip'] },
  { label: 'File', items: ['FileUpload'] },
  { label: 'Menu', items: ['Breadcrumb', 'ContextMenu', 'Dock', 'Menu', 'Menubar', 'MegaMenu', 'PanelMenu', 'TieredMenu'] },
  { label: 'Messages', items: ['Message', 'Toast'] },
  { label: 'Media', items: ['Carousel', 'Galleria', 'Image', 'ImageCompare'] },
  {
    label: 'Misc',
    items: ['Avatar', 'Badge', 'BlockUI', 'Chip', 'Inplace', 'MeterGroup', 'OverlayBadge',
      'ProgressBar', 'ProgressSpinner', 'ScrollTop', 'Skeleton', 'Tag', 'Terminal'],
  },
]

export const allComponents = categories.flatMap(c => c.items.map(name => ({ name, category: c.label })))

export const slugOf = name => name.toLowerCase()

export const findBySlug = slug => allComponents.find(c => slugOf(c.name) === slug)

export const docUrl = name => `https://primevue.org/${slugOf(name)}/`

// Playground configuration: components that can render standalone get live
// prop controls on their catalog page. Controls are auto-generated from the
// extracted API types (see [slug].vue); this file only provides what the bare
// component needs to render:
//   load      dynamic import of the component itself
//   seed      base props applied before user edits
//   model     initial v-model value (presence enables v-model binding)
//   content   default-slot text
//   stageStyle inline style for the stage wrapper (e.g. widths for sliders)
const cities = ['New York', 'Rome', 'London', 'Istanbul', 'Paris']

export const playgrounds = {
  // Form
  Checkbox: { load: () => import('primevue/checkbox'), seed: { binary: true }, model: true },
  ColorPicker: { load: () => import('primevue/colorpicker'), model: '6466f1' },
  DatePicker: { load: () => import('primevue/datepicker'), seed: { placeholder: 'Pick a date' }, model: null },
  InputMask: { load: () => import('primevue/inputmask'), seed: { mask: '(999) 999-9999', placeholder: '(999) 999-9999' }, model: '' },
  InputNumber: { load: () => import('primevue/inputnumber'), model: 42 },
  InputOtp: { load: () => import('primevue/inputotp'), model: '' },
  InputText: { load: () => import('primevue/inputtext'), seed: { placeholder: 'Type something' }, model: '' },
  Knob: { load: () => import('primevue/knob'), model: 60 },
  Listbox: { load: () => import('primevue/listbox'), seed: { options: cities }, model: null, stageStyle: 'width: 14rem' },
  MultiSelect: { load: () => import('primevue/multiselect'), seed: { options: cities, placeholder: 'Select cities' }, model: null, stageStyle: 'width: 16rem' },
  Password: { load: () => import('primevue/password'), seed: { placeholder: 'Password' }, model: '' },
  RadioButton: { load: () => import('primevue/radiobutton'), seed: { value: 'A' }, model: 'A' },
  Rating: { load: () => import('primevue/rating'), model: 4 },
  Select: { load: () => import('primevue/select'), seed: { options: cities, placeholder: 'Select a city' }, model: null, stageStyle: 'width: 14rem' },
  SelectButton: { load: () => import('primevue/selectbutton'), seed: { options: ['One-Way', 'Return'] }, model: 'One-Way' },
  Slider: { load: () => import('primevue/slider'), model: 50, stageStyle: 'width: 14rem' },
  Textarea: { load: () => import('primevue/textarea'), seed: { rows: 4, cols: 30, placeholder: 'Your message' }, model: '' },
  ToggleButton: { load: () => import('primevue/togglebutton'), seed: { onLabel: 'Locked', offLabel: 'Unlocked' }, model: false },
  ToggleSwitch: { load: () => import('primevue/toggleswitch'), model: true },

  // Button
  Button: { load: () => import('primevue/button'), seed: { label: 'Button' } },
  SplitButton: {
    load: () => import('primevue/splitbutton'),
    seed: { label: 'Save', model: [{ label: 'Update' }, { label: 'Delete' }] },
  },

  // Data
  Paginator: { load: () => import('primevue/paginator'), seed: { rows: 10, totalRecords: 120 }, stageStyle: 'width: 100%' },

  // Panel
  Divider: { load: () => import('primevue/divider'), content: 'OR', stageStyle: 'width: 100%' },
  Fieldset: { load: () => import('primevue/fieldset'), seed: { legend: 'User Details' }, content: 'Fieldset content — edit the props to reshape this panel.', stageStyle: 'width: 100%' },
  Panel: { load: () => import('primevue/panel'), seed: { header: 'Header' }, content: 'Panel content — edit the props to reshape this panel.', stageStyle: 'width: 100%' },

  // Messages
  Message: { load: () => import('primevue/message'), content: 'Message content', stageStyle: 'width: 100%' },

  // Media
  Image: {
    load: () => import('primevue/image'),
    seed: {
      alt: 'Playground image',
      width: '220',
      src: `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'>` +
        `<rect width='100%' height='100%' fill='#0ea5e9'/>` +
        `<text x='50%' y='50%' fill='white' font-size='28' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>Image</text></svg>`,
      )}`,
    },
  },

  // Misc
  Avatar: { load: () => import('primevue/avatar'), seed: { label: 'P' } },
  Badge: { load: () => import('primevue/badge'), seed: { value: '2' } },
  Chip: { load: () => import('primevue/chip'), seed: { label: 'Action' } },
  MeterGroup: {
    load: () => import('primevue/metergroup'),
    seed: {
      value: [
        { label: 'Apps', value: 24, color: '#6366f1' },
        { label: 'Messages', value: 16, color: '#0ea5e9' },
        { label: 'Media', value: 32, color: '#10b981' },
      ],
    },
    stageStyle: 'width: 100%',
  },
  ProgressBar: { load: () => import('primevue/progressbar'), seed: { value: 65 }, stageStyle: 'width: 100%' },
  ProgressSpinner: { load: () => import('primevue/progressspinner') },
  Skeleton: { load: () => import('primevue/skeleton'), seed: { width: '12rem', height: '3rem' } },
  Tag: { load: () => import('primevue/tag'), seed: { value: 'Tag' } },
}

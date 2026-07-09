<script setup>
const items = [
  {
    label: 'Furniture', icon: 'pi pi-box',
    items: [
      [
        { label: 'Living Room', items: [{ label: 'Accessories' }, { label: 'Armchair' }, { label: 'Sofa' }] },
        { label: 'Kitchen', items: [{ label: 'Bar stool' }, { label: 'Chair' }, { label: 'Table' }] },
      ],
      [
        { label: 'Bedroom', items: [{ label: 'Bed' }, { label: 'Lamp' }, { label: 'Wardrobe' }] },
        { label: 'Office', items: [{ label: 'Bookcase' }, { label: 'Desk' }] },
      ],
    ],
  },
  {
    label: 'Electronics', icon: 'pi pi-mobile',
    items: [
      [
        { label: 'Computer', items: [{ label: 'Monitor' }, { label: 'Mouse' }, { label: 'Notebook' }] },
        { label: 'Home Theater', items: [{ label: 'Projector' }, { label: 'Speakers' }, { label: 'TV' }] },
      ],
    ],
  },
]
</script>

<template>
  <MegaMenu :model="items" style="width: 100%" />
</template>

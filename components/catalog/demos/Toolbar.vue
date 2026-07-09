<template>
  <Toolbar style="width: 100%">
    <template #start>
      <Button icon="pi pi-plus" text />
      <Button icon="pi pi-print" text />
      <Button icon="pi pi-upload" text />
    </template>
    <template #center>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText placeholder="Search" />
      </IconField>
    </template>
    <template #end>
      <SplitButton label="Save" :model="[{ label: 'Save As' }, { label: 'Export' }]" />
    </template>
  </Toolbar>
</template>

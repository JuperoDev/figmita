<template>
  <div style="width: 100%; height: 200px; overflow: auto; border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 0 16px; position: relative;">
    <p v-for="i in 12" :key="i">
      Paragraph {{ i }}: scroll down inside this box, then use the button to return to the top.
    </p>
    <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
  </div>
</template>

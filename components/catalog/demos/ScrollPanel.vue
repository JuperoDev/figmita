<template>
  <ScrollPanel style="width: 100%; height: 120px">
    <p v-for="i in 6" :key="i">
      Paragraph {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </ScrollPanel>
</template>

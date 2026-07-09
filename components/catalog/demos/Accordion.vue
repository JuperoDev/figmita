<script setup>
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
</script>

<template>
  <Accordion value="0" style="width: 100%">
    <AccordionPanel value="0">
      <AccordionHeader>Header I</AccordionHeader>
      <AccordionContent><p class="m-0">{{ lorem }}</p></AccordionContent>
    </AccordionPanel>
    <AccordionPanel value="1">
      <AccordionHeader>Header II</AccordionHeader>
      <AccordionContent><p class="m-0">{{ lorem }}</p></AccordionContent>
    </AccordionPanel>
    <AccordionPanel value="2">
      <AccordionHeader>Header III</AccordionHeader>
      <AccordionContent><p class="m-0">{{ lorem }}</p></AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

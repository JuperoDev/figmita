<template>
  <Card style="width: 22rem">
    <template #title>Simple Card</template>
    <template #subtitle>Card subtitle</template>
    <template #content>
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </template>
    <template #footer>
      <div class="flex gap-2" style="margin-top: 8px">
        <Button label="Save" style="flex: 1" />
        <Button label="Cancel" severity="secondary" outlined style="flex: 1" />
      </div>
    </template>
  </Card>
</template>

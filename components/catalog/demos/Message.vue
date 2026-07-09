<template>
  <div class="flex flex-col gap-3" style="width: 100%">
    <Message severity="success">Success message</Message>
    <Message severity="info">Info message</Message>
    <Message severity="warn">Warn message</Message>
    <Message severity="error">Error message</Message>
    <Message severity="secondary">Secondary message</Message>
    <Message severity="contrast">Contrast message</Message>
    <Message severity="info" icon="pi pi-send" closable>Closable message with a custom icon</Message>
    <Message severity="warn" variant="outlined">Outlined variant</Message>
    <Message severity="success" variant="simple">Simple variant</Message>
  </div>
</template>

<script setup>
const confirm = useConfirm()
const toast = useToast()

const open = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Confirm' },
    accept: () => toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You accepted', life: 2500 }),
    reject: () => toast.add({ severity: 'warn', summary: 'Rejected', detail: 'You rejected', life: 2500 }),
  })
}
</script>

<template>
  <ConfirmDialog />
  <Button label="Open confirm dialog" icon="pi pi-check-circle" @click="open" />
</template>

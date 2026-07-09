<script setup>
const confirm = useConfirm()
const toast = useToast()

const open = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Delete this record?',
    icon: 'pi pi-info-circle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: () => toast.add({ severity: 'error', summary: 'Deleted', life: 2500 }),
  })
}
</script>

<template>
  <ConfirmPopup />
  <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="open" />
</template>

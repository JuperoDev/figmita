<script setup>
const toast = useToast()

const onUpload = (event) => {
  toast.add({
    severity: 'info',
    summary: 'Files selected',
    detail: event.files.map(f => f.name).join(', '),
    life: 3000,
  })
}
</script>

<template>
  <FileUpload mode="basic" choose-label="Choose file" custom-upload auto @uploader="onUpload" />
</template>

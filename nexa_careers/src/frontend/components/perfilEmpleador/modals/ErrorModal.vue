<template>
  <BaseModal
    :visible="visible"
    type="error"
    title="Error al guardar"
    message="Intenta nuevamente."
    actionText="Reintentar"
    @close="$emit('close')"
    @action="$emit('retry')"
  />
</template>

<script setup>
import BaseModal from "./BaseModal.vue";
defineProps({ visible: Boolean });
</script>
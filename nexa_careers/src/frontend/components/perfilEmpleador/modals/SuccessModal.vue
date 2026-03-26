<template>
  <BaseModal
    :visible="visible"
    type="success"
    title="¡Cuenta actualizada!"
    message="Los cambios se guardaron correctamente."
    actionText="OK"
    @close="$emit('close')"
    @action="$emit('close')"
  />
</template>

<script setup>
import BaseModal from "./BaseModal.vue";
defineProps({ visible: Boolean });
</script>
<template>
  <span
    class="px-2 py-1 rounded-full text-xs font-semibold"
    :class="activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
  >
    {{ activo ? 'Activo' : 'Inactivo' }}
  </span>
</template>

<script setup>
defineProps({
  activo: { type: [Boolean, Number], required: true }
})
</script>
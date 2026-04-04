<template>
  <span class="text-xs font-semibold px-3 py-1 rounded-full" :class="estiloEstado">
    {{ textoEstado }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: { type: Number, required: true }
})

const textoEstado = computed(() => {
  const map = { 0: 'Pendiente', 1: 'Aceptado', 2: 'Rechazado', 3: 'Archivado' }
  return map[props.estado] ?? 'Desconocido'
})

const estiloEstado = computed(() => {
  const map = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100 text-green-700',
    2: 'bg-red-100 text-red-700',
    3: 'bg-gray-100 text-gray-500'
  }
  return map[props.estado] ?? 'bg-gray-100 text-gray-500'
})
</script>
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

const ESTADOS = {
  0: { texto: 'Pendiente',    estilo: 'bg-yellow-100 text-yellow-700' },
  1: { texto: 'Activa',       estilo: 'bg-green-100 text-green-700'   },
  2: { texto: 'Rechazada',    estilo: 'bg-red-100 text-red-700'       },
  3: { texto: 'Dada de baja', estilo: 'bg-gray-100 text-gray-500'     },
}

const textoEstado  = computed(() => ESTADOS[props.estado]?.texto  ?? 'Desconocido')
const estiloEstado = computed(() => ESTADOS[props.estado]?.estilo ?? 'bg-gray-100 text-gray-500')
</script>
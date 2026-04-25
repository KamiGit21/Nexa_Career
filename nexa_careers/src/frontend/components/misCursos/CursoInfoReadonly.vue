<template>
  <div class="grid grid-cols-2 gap-4 pt-2">
    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">
        Fecha de creación
      </label>
      <p class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
        {{ fechaFormateada }}
      </p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">
        Estado actual
      </label>
      <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
        <CursoEstadoBadge :estado="estado" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CursoEstadoBadge from '../misCursos/CursoEstadoBadge.vue'

const props = defineProps({
  fechaCreacion: { type: String, default: '' },
  estado:        { type: Number, default: 0  }
})

const fechaFormateada = computed(() => {
  if (!props.fechaCreacion) return '—'
  return new Date(props.fechaCreacion).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
})
</script>
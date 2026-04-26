<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="font-bold text-[#1b2a4a] text-lg leading-tight">{{ curso.curso }}</h3>
      <CursoEstadoBadge :estado="curso.estado" />
    </div>

    <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ curso.descripcion || 'Sin descripción' }}</p>

    <div class="flex justify-between items-center text-xs text-gray-400 mb-5">
      <span>📅 {{ formatearFecha(curso.fecha_creacion) }}</span>
      <span>📞 {{ curso.contacto }}</span>
    </div>

    <!-- NUEVO: acciones -->
    <div class="border-t border-gray-100 pt-4">
      <p v-if="curso.estado === 3" class="text-center text-sm text-gray-400 font-medium">
        Curso dado de baja
      </p>
      <div v-else class="flex gap-2">
        <button
          @click="$emit('dar-de-baja', curso)"
          class="flex-1 py-2 text-xs font-semibold text-red-600
                 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
        🚫 Dar de Baja
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CursoEstadoBadge from './CursoEstadoBadge.vue'

defineProps({
  curso: { type: Object, required: true }
})

defineEmits(['editar', 'dar-de-baja'])

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>
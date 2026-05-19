<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all flex flex-col h-full">

    <div class="flex justify-between items-start mb-3">
      <div class="w-10 h-10 bg-[#1b2a4a]/10 rounded-lg flex items-center justify-center text-xl">
        💼
      </div>
      <OfertaEstadoBadge :estado="oferta.estado" />
    </div>

    <h3 class="font-bold text-[#1b2a4a] text-lg leading-tight mb-1">{{ oferta.oferta }}</h3>
    <p class="text-xs text-[#b5943a] font-semibold mb-2">{{ oferta.categoria || 'General' }}</p>
    <p class="text-sm text-gray-500 line-clamp-2 flex-grow mb-3">
      {{ oferta.descripcion || 'Sin descripción' }}
    </p>

    <div class="flex justify-between text-xs text-gray-400 mb-4">
      <span>📅 {{ formatearFecha(oferta.fecha_apertura) }}</span>
      <span>👥 {{ oferta.postulantes_count || 0 }} postulantes</span>
    </div>

    <div v-if="oferta.estado === 2" class="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs">
      <p class="font-semibold">Motivo de rechazo</p>
      <p>{{ oferta.rechazo || oferta.motivo_rechazo || 'No se especificó un motivo.' }}</p>
    </div>

    <div class="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
      <button
        @click="$emit('ver-detalle', oferta)"
        class="flex-1 py-2 text-xs font-semibold text-[#1b2a4a] border border-[#1b2a4a]/30
               rounded-xl hover:bg-[#1b2a4a] hover:text-white transition-colors"
      >
        Ver detalle
      </button>

      <button
        @click="$emit('editar', oferta)"
        class="flex-1 py-2 text-xs font-semibold text-yellow-600 border border-yellow-200
               rounded-xl hover:bg-yellow-50 transition-colors"
      >
        Editar
      </button>

<button
        @click="$emit('postulantes', oferta)"
        class="flex-1 py-2 text-xs font-semibold text-[#1b2a4a] border border-[#1b2a4a]/30
               rounded-xl hover:bg-[#1b2a4a] hover:text-white transition-colors"
      >
        Ver postulantes
      </button>

      <button
        @click="$emit('dar-de-baja', oferta)"
        :disabled="oferta.estado === 3"
        class="w-full py-2 text-xs font-semibold rounded-xl transition-colors"
        :class="oferta.estado === 3
          ? 'text-gray-400 border border-gray-200 cursor-not-allowed'
          : 'text-red-600 border border-red-200 hover:bg-red-50'"
      >
        {{ oferta.estado === 3 ? 'Dada de baja' : 'Dar de baja' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import OfertaEstadoBadge from './OfertaEstadoBadge.vue'

defineProps({ oferta: { type: Object, required: true } })
defineEmits(['ver-detalle', 'editar', 'dar-de-baja', 'postulantes'])

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
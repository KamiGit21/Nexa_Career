<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="$emit('cerrar')"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 max-h-[90vh] overflow-y-auto">

        <div class="flex justify-between items-start gap-4">
          <h2 class="text-xl font-bold text-[#1b2a4a] leading-tight">{{ oferta?.oferta }}</h2>
          <button @click="$emit('cerrar')" class="text-gray-400 hover:text-gray-600 text-xl flex-shrink-0">✕</button>
        </div>

        <OfertaEstadoBadge v-if="oferta" :estado="oferta.estado" />

        <div class="space-y-3 text-sm text-gray-600">
          <div>
            <span class="font-semibold text-[#1b2a4a]">Categoría:</span>
            <span class="ml-2">{{ oferta?.categoria || 'General' }}</span>
          </div>
          <div>
            <span class="font-semibold text-[#1b2a4a]">Fecha de apertura:</span>
            <span class="ml-2">{{ formatearFecha(oferta?.fecha_apertura) }}</span>
          </div>
          <div>
            <span class="font-semibold text-[#1b2a4a]">Postulantes:</span>
            <span class="ml-2">{{ oferta?.postulantes_count || 0 }}</span>
          </div>
          <div>
            <p class="font-semibold text-[#1b2a4a] mb-1">Descripción:</p>
            <p class="text-gray-500 leading-relaxed">{{ oferta?.descripcion || 'Sin descripción' }}</p>
          </div>
        </div>

        <!-- Motivo de rechazo: visible solo cuando estado === 2 -->
        <div v-if="oferta?.estado === 2" class="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1">
          <p class="text-sm font-bold text-red-700">Motivo de rechazo</p>
          <p class="text-sm text-red-600 leading-relaxed">
            {{ oferta.motivo_rechazo || 'No se especificó un motivo.' }}
          </p>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            @click="$emit('cerrar')"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                   text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            @click="$emit('ver-postulantes', oferta)"
            class="flex-1 py-2.5 bg-[#1b2a4a] text-white rounded-xl text-sm font-semibold
                   hover:bg-[#0f1a2e] transition-colors"
          >
            Ver postulantes
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import OfertaEstadoBadge from './OfertaEstadoBadge.vue'

defineProps({
  visible: { type: Boolean, default: false },
  oferta:  { type: Object,  default: null  },
})

defineEmits(['cerrar', 'ver-postulantes'])

const formatearFecha = (fecha) => {
  if (!fecha) return 'No especificada'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
</style>
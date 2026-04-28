<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
    @click="$emit('click-detalle', oferta.id_oferta)"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="w-12 h-12 bg-[#1b2a4a]/10 rounded-lg flex items-center justify-center text-2xl">
        💼
      </div>
      <span v-if="esNueva" class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
        Nueva
      </span>
    </div>

    <h2 class="text-lg font-bold text-[#1b2a4a] hover:text-[#b89b4d] transition-colors">
      {{ oferta.oferta }}
    </h2>

    <p class="text-sm text-gray-500 line-clamp-3 my-3">
      {{ oferta.descripcion || 'Sin descripción' }}
    </p>

    <div class="flex justify-between items-center pt-4 border-t border-gray-100">
      <span class="text-xs text-gray-400">{{ fechaFormateada }}</span>
      <span class="text-[#1b2a4a] font-bold text-sm hover:underline">Ver detalle →</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  oferta: Object
})

const fechaFormateada = computed(() => {
  if (!props.oferta.fecha_apertura) return 'Fecha no especificada'
  return new Date(props.oferta.fecha_apertura).toLocaleDateString('es-ES')
})

const esNueva = computed(() => {
  if (!props.oferta.fecha_apertura) return false
  const diffDias = Math.floor((new Date() - new Date(props.oferta.fecha_apertura)) / (1000 * 60 * 60 * 24))
  return diffDias <= 7
})
</script>
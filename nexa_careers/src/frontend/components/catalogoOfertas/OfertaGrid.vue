<template>
  <section class="py-8">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b2a4a] mb-4"></div>
      <p class="text-gray-500 font-medium">Buscando las mejores ofertas para ti...</p>
    </div>

    <div v-else-if="error" class="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
      <div class="text-4xl mb-4">⚠️</div>
      <p class="text-red-600 font-semibold mb-4">{{ error }}</p>
      <button 
        @click="$emit('reintentar')" 
        class="bg-[#1b2a4a] text-white px-8 py-2 rounded-lg hover:bg-slate-800 transition-colors"
      >
        Reintentar conexión
      </button>
    </div>

    <div v-else-if="ofertas.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
      <div class="text-5xl mb-4">🔍</div>
      <h3 class="text-xl font-bold text-[#1b2a4a]">No encontramos resultados</h3>
      <p class="text-gray-500 mt-2">Intenta ajustar tus filtros de búsqueda.</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <OfertaCard 
          v-for="oferta in ofertas" 
          :key="oferta.id_oferta"
          :oferta="oferta"
          @click-detalle="(id) => $emit('ver-detalle', id)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import OfertaCard from './OfertaCard.vue'

defineProps({
  ofertas: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

defineEmits(['reintentar', 'ver-detalle'])
</script>
<template>
  <div v-if="loading" class="text-center py-20 text-gray-500">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b2a4a] mx-auto mb-4"></div>
    Cargando tus ofertas...
  </div>

  <div v-else-if="ofertas.length === 0" class="text-center py-20 text-gray-400">
    <p class="text-5xl mb-4">📭</p>
    <p class="text-lg font-medium">
      {{ filtroActivo ? 'No hay ofertas que coincidan con tu búsqueda' : 'Aún no tienes ofertas publicadas.' }}
    </p>
    <p class="text-sm mt-1">
      {{ filtroActivo ? 'Prueba con otros términos o limpia los filtros' : 'Cuando crees una oferta aparecerá aquí.' }}
    </p>
    <router-link
      v-if="!filtroActivo"
      to="/mis-ofertas/nueva"
      class="inline-block mt-6 px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl
             font-medium hover:bg-[#0f1a2e] transition-colors"
    >
      + Crear Oferta
    </router-link>
  </div>

  <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <MiOfertaCard
      v-for="oferta in ofertas"
      :key="oferta.id_oferta"
      :oferta="oferta"
      @ver-detalle="$emit('ver-detalle', $event)"
      @editar="$emit('editar', $event)"
      @dar-de-baja="$emit('dar-de-baja', $event)"
      @postulantes="$emit('postulantes', $event)"
    />
  </div>
</template>

<script setup>
import MiOfertaCard from './MiOfertaCard.vue'

defineProps({
  ofertas:      { type: Array,   default: () => [] },
  loading:      { type: Boolean, default: false     },
  filtroActivo: { type: Boolean, default: false     },
})

defineEmits(['ver-detalle', 'editar', 'dar-de-baja'])
</script>
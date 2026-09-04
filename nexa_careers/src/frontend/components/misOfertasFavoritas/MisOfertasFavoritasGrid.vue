<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <OfertaCard
      v-for="oferta in ofertas"
      :key="oferta.id_oferta"
      :oferta="oferta"
      @click-detalle="(id) => emit('ver', id)"
    />
  </div>
</template>

<script setup>
import OfertaCard from '../catalogoOfertas/OfertaCard.vue'

defineProps({
  ofertas: { type: Array, required: true }
})

const emit = defineEmits(['ver'])
</script>
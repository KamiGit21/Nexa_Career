<template>
  <div class="min-h-screen bg-[#f8f5f0] pb-20">
    <div class="max-w-7xl mx-auto px-6 py-10">
      <MisOfertasFavoritasHeader />

      <MisOfertasFavoritasVacio v-if="favoritos.length === 0" />

      <template v-else>
        <p class="text-sm text-gray-500 mb-6">
          {{ favoritos.length }} oferta{{ favoritos.length !== 1 ? 's' : '' }} guardada{{ favoritos.length !== 1 ? 's' : '' }}
        </p>
        <MisOfertasFavoritasGrid :ofertas="favoritos" @ver="irDetalle" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerFavoritosPorEstudiante } from '../services/OfertasFavoritos.js'
import MisOfertasFavoritasHeader from '../components/misOfertasFavoritas/MisOfertasFavoritasHeader.vue'
import MisOfertasFavoritasVacio  from '../components/misOfertasFavoritas/MisOfertasFavoritasVacio.vue'
import MisOfertasFavoritasGrid   from '../components/misOfertasFavoritas/MisOfertasFavoritasGrid.vue'

const router    = useRouter()
const sesion    = JSON.parse(localStorage.getItem('sesion') || '{}')
const favoritos = ref([])

onMounted(async () => {
  favoritos.value = await obtenerFavoritosPorEstudiante(sesion.id)
  // TODO (integración): agregar manejo de loading y error
})

const irDetalle = (id) => router.push(`/ofertas/${id}`)
</script>
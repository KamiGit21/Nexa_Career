<template>
  <div class="min-h-screen bg-[#f8f5f0] pb-20">
    <div class="max-w-7xl mx-auto px-6 py-10">
      <MisFavoritosHeader />

      <MisFavoritosVacio v-if="favoritos.length === 0" />

      <template v-else>
        <p class="text-sm text-gray-500 mb-6">
          {{ favoritos.length }} curso{{ favoritos.length !== 1 ? 's' : '' }} guardado{{ favoritos.length !== 1 ? 's' : '' }}
        </p>
        <MisFavoritosGrid :cursos="favoritos" @ver="irDetalle" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerFavoritosPorEstudiante } from '../services/CursoFavoritos.js'
import MisFavoritosHeader from '../components/misFavoritos/MisFavoritosHeader.vue'
import MisFavoritosVacio  from '../components/misFavoritos/MisFavoritosVacio.vue'
import MisFavoritosGrid   from '../components/misFavoritos/MisFavoritosGrid.vue'

const router   = useRouter()
const sesion   = JSON.parse(localStorage.getItem('sesion') || '{}')
const favoritos = ref([])

onMounted(async () => {
  favoritos.value = await obtenerFavoritosPorEstudiante(sesion.id)
  // TODO (integración): agregar manejo de loading y error
})

const irDetalle = (id) => router.push(`/cursos/${id}`)
</script>
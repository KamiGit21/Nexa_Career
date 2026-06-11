<template>
  <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Cursos Disponibles</h2>
        <p class="mt-1 text-sm text-gray-500">Potencia tus habilidades con nuestra oferta académica.</p>
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="scroll('left')" 
          class="p-2 rounded-full border border-[#1B2A4A] bg-[#1B2A4A] text-white hover:bg-[#b5943a] hover:border-[#b5943a] transition-colors duration-300"
        >
          ←
        </button>
        <button 
          @click="scroll('right')" 
          class="p-2 rounded-full border border-[#1B2A4A] bg-[#1B2A4A] text-white hover:bg-[#b5943a] hover:border-[#b5943a] transition-colors duration-300"
        >
          →
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando cursos...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="cursos.length === 0" class="text-center py-12">
      <p class="text-gray-500">No hay cursos disponibles en este momento.</p>
    </div>

    <div v-else
      ref="carouselRef"
      class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 -mx-2"
    >
      <CursoCard 
        v-for="curso in cursos" 
        :key="curso.id_curso || curso.id" 
        :curso="curso"
        class="snap-start"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CursoCard from './CursoCard.vue'
import { listarCursosPublicosPaginadosPorFecha } from '@/services/cursoService'

const carouselRef = ref(null)
const cursos = ref([])
const loading = ref(true)
const error = ref(null)

// Obtener cursos más recientes (descendente) con estado 1 (aceptado)
const cargarCursos = async () => {
  try {
    loading.value = true
    error.value = null
    // Obtener la primera página de cursos con dirección 'abajo' (descendente/más recientes) y estado 1
    const response = await listarCursosPublicosPaginadosPorFecha(1, 8, 'abajo')
    
    if (response.success && response.data) {
      cursos.value = response.data
    } else {
      error.value = 'No se pudieron cargar los cursos'
      cursos.value = []
    }
  } catch (err) {
    console.error('Error al cargar cursos:', err)
    error.value = err.message
    cursos.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarCursos()
})

const scroll = (direction) => {
  if (carouselRef.value) {
    const offset = direction === 'left' ? -320 : 320
    carouselRef.value.scrollBy({ left: offset, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
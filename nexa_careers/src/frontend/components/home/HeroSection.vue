<template>
  <section class="relative bg-[#fffffd] pt-16 pb-20 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-8">
        <h1 class="text-6xl md:text-7xl font-bold leading-none text-[#1b2a4a] tracking-tighter">
          ¡Empieza a adquirir<br>experiencia ya!
        </h1>
        <p class="text-xl text-gray-600 max-w-lg">
          Busca tu oportunidad de carrera y especialízate en todos puestos que tenemos para ti.
        </p>

        <div v-if="loading" class="flex gap-12 pt-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-10 w-20 bg-gray-200 rounded"></div>
            <div class="h-3 w-28 bg-gray-200 rounded mt-3"></div>
          </div>
        </div>

        <div v-else class="flex gap-6 pt-6">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-4xl font-bold text-[#1b2a4a]">{{ stat.value }}</div>
            <div class="text-sm text-gray-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="relative flex justify-center">
          <img src="../../assets/images/hero.png" alt="Hero" class="w-[500px] h-[500px] object-contain rounded-[3rem]">
        </div>
      </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { contarOfertasPorEstado } from '../../services/ofertaService.js'
import { contarCursosPorEstado } from '../../services/cursoService.js'
import { contarEmpleadoresPorActivo } from '../../services/empleadorService.js'
import { contarPostulacionesPorEstado } from '../../services/postulacionService.js'

const stats = ref([])
const loading = ref(true)

const cargarStats = async () => {
  loading.value = true
  try {
    const [ofertasRes, cursosRes, empleadoresRes, postulacionesRes] = await Promise.all([
      contarOfertasPorEstado(1),
      contarCursosPorEstado(1),
      contarEmpleadoresPorActivo(1),
      contarPostulacionesPorEstado(1)
    ])

    stats.value = [
      { value: `${ofertasRes.data.total}`, label: 'Ofertas laborales activas' },
      { value: `${cursosRes.data.total}`, label: 'Cursos publicados' },
      { value: `${empleadoresRes.data.total}`, label: 'Empresas aliadas' },
      { value: `${postulacionesRes.data.total}`, label: 'Entrevistas conseguidas' } 
    ]
    
  } catch (e) {
    console.error('❌ Error al cargar las estadísticas del Home:', e)
    stats.value = [
      { value: '0', label: 'Ofertas laborales activas' },
      { value: '0', label: 'Cursos publicados' },
      { value: '0', label: 'Empresas aliadas' },
      { value: '0', label: 'Entrevistas conseguidas' }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(cargarStats)
</script>
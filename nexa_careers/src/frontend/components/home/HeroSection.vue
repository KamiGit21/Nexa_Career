<template>
  <section class="hero flex justify-between items-start px-12 pt-12 pb-8 bg-[#fffffd]">
    <div class="max-w-[650px]">
      <h1 class="font-semibold text-[#002349] text-[65px] leading-none">¡Empieza a adquirir experiencia ya!</h1>
      <p class="text-[#545454] text-[25px] mt-8">Busca tu oportunidad de carrera entre más de 1200 puestos que tenemos</p>
      
      <div v-if="loading" class="stats flex gap-16 mt-12">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-12 w-24 bg-gray-200 rounded"></div>
          <div class="h-4 w-32 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>

      <div v-else class="stats flex gap-16 mt-12">
        <div v-for="stat in stats" :key="stat.label">
          <h2 class="font-semibold text-[#002349] text-[50px]">{{ stat.value }}</h2>
          <span class="text-[#545454] text-lg">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="w-[563px] h-[563px] bg-gradient-to-br from-[#b8d4e8] to-[#e8f0fb] rounded-full flex items-center justify-center text-8xl">🚀</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([])
const loading = ref(true)

// TODO: GET /api/stats o /api/dashboard/stats
const cargarStats = async () => {
  loading.value = true
  try {
    // const res = await fetch('/api/stats')
    // stats.value = await res.json()

    // Datos temporales - eliminar cuando conectes el backend
    stats.value = [
      { value: '+1235', label: 'Estudiantes registrados' },
      { value: '+156', label: 'Empresas aliadas' },
      { value: '+820', label: 'Entrevistas conseguidas' }
    ]
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  } finally {
    loading.value = false
  }
}

onMounted(cargarStats)
</script>
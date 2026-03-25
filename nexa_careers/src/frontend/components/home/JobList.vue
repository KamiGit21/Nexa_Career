<template>
  <section class="jobs px-12 py-12 bg-[#fff8ec]">
    <h2 class="font-bold text-[#002349] text-[35px] mb-8">Algunas Ofertas Laborales:</h2>
    
    <div v-if="loading" class="text-center py-12 text-[#002349]">Cargando ofertas...</div>
    
    <div v-else-if="jobs.length === 0" class="text-center py-12 text-gray-500">
      No hay ofertas disponibles en este momento.
    </div>
    
    <div v-else class="grid grid-cols-3 gap-8">
      <JobCard 
        v-for="job in jobs" 
        :key="job.id" 
        :job="job" 
        @ver-mas="emitirModal" 
      />
    </div>
  </section>
</template>

<script setup>
import JobCard from './JobCard.vue'
import { ref, onMounted } from 'vue'

const jobs = ref([])
const loading = ref(true)
const emit = defineEmits(['abrir-modal'])

const emitirModal = (job) => emit('abrir-modal', job)

// TODO: GET /api/ofertas?limit=6&estado=activa
const cargarOfertas = async () => {
  loading.value = true
  try {
    // Simulación mientras no tengas backend
    // const res = await fetch('/api/ofertas?limit=6')
    // jobs.value = await res.json()

    // Datos de ejemplo temporal (quitar cuando conectes backend)
    jobs.value = [
      { id: 1, title: 'Analista Financiero', company: 'Eventos Chuno', categories: ['Finanzas'], descripcion: 'Evalúa datos económicos...' },
      { id: 2, title: 'Programador Junior Java', company: 'Asuresoft', categories: ['Tecnología'], descripcion: 'Desarrollo con Spring Boot...' }
      // ... agrega más cuando tengas la API
    ]
  } catch (e) {
    console.error('Error cargando ofertas', e)
  } finally {
    loading.value = false
  }
}

onMounted(cargarOfertas)
</script>
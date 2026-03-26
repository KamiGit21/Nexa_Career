<template>
  <section class="py-16 bg-[#fff8ec]">
    <div class="max-w-7xl mx-auto px-6">
      <h2 class="text-4xl font-bold text-[#1b2a4a] mb-10">Algunas Ofertas Laborales</h2>
      
      <div v-if="loading" class="text-center py-20 text-gray-500">Cargando ofertas...</div>
      
      <div v-else-if="jobs.length === 0" class="text-center py-20 text-gray-500">
        No hay ofertas disponibles en este momento.
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8">
        <JobCard v-for="job in jobs" :key="job.id" :job="job" @ver-mas="emitirModal" />
      </div>
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

// TODO: GET /api/ofertas?limit=6
const cargarOfertas = async () => {
  loading.value = true
  try {
    // const res = await fetch('/api/ofertas?limit=6')
    // jobs.value = await res.json()
    
    jobs.value = [] // Se llenará desde el backend
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(cargarOfertas)
</script>
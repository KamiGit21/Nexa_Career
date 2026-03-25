<script setup>
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CategoryGrid from '@/components/home/CategoryGrid.vue'
import JobList from '@/components/home/JobList.vue'

const modalAbierto = ref(false)
const ofertaSeleccionada = ref(null)

const abrirModal = (job) => {
  ofertaSeleccionada.value = job
  modalAbierto.value = true
}
const cerrarModal = () => {
  modalAbierto.value = false
  ofertaSeleccionada.value = null
}
const postular = () => {
  // TODO: POST /api/ofertante
  alert('¡Postulación enviada exitosamente!')
  cerrarModal()
}
</script>

<template>
  <div class="min-w-[1440px] min-h-screen bg-[#fffffd]">
    <Navbar />
    <HeroSection />
    <CategoryGrid />
    <JobList @abrir-modal="abrirModal" />

    <!-- Modal -->
    <div v-if="modalAbierto" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" @click="cerrarModal">
      <div @click.stop class="w-[900px] bg-white rounded-[25px] p-12 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-center text-[#d0b06d] text-[50px] font-semibold mb-4">{{ ofertaSeleccionada?.title }}</h2>
        <p class="text-center text-[#002349] text-3xl mb-6"><strong>Empresa:</strong> {{ ofertaSeleccionada?.company }}</p>
        <hr class="border-[#d0b06d] my-6" />
        <p class="text-[#002349] text-[25px] leading-relaxed">{{ ofertaSeleccionada?.descripcion || 'Descripción completa de la oferta' }}</p>
        <div class="flex justify-center gap-6 mt-10">
          <button @click="postular" class="w-[285px] h-[65px] bg-[#d4e5f2] rounded-[15px] text-[#002349] text-[30px] font-semibold hover:bg-[#b8d4e8]">Postular</button>
          <button @click="cerrarModal" class="w-[285px] h-[65px] bg-[#002349] rounded-[15px] text-[#d0b06d] text-[30px] font-semibold">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>
<template>
  <div class="min-h-screen bg-[#fffffd]">
    
    <HeroSection />
    <CategoryGrid />
    <JobList @abrir-modal="abrirModal" />

    <!-- Modal Mejorado -->
    <transition name="modal">
      <div v-if="modalAbierto" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div @click.stop class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="px-8 py-6 border-b flex justify-between items-center">
            <h2 class="text-2xl font-bold text-[#1b2a4a]">{{ ofertaSeleccionada?.title }}</h2>
            <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 text-3xl leading-none">×</button>
          </div>
          
          <div class="p-8">
            <p class="text-[#002349] text-xl"><strong>Empresa:</strong> {{ ofertaSeleccionada?.company }}</p>
            <p class="mt-6 text-gray-700 leading-relaxed">{{ ofertaSeleccionada?.descripcion }}</p>
          </div>

          <div class="px-8 py-6 border-t flex gap-4">
            <button @click="postular" 
                    class="flex-1 py-4 bg-gradient-to-r from-[#1b2a4a] to-[#002349] text-white font-semibold rounded-2xl hover:brightness-110 transition-all">
              Postular Ahora
            </button>
            <button @click="cerrarModal" 
                    class="flex-1 py-4 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
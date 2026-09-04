<template>
  <div class="min-h-screen bg-[#fffffd]">
    
    <HeroSection />
    <TipsSection />
    <OfertasCarousel />
    <CursoCarousel />
    <CategoryGrid />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import TipsSection from '@/components/home/TipsSection.vue'
import CategoryGrid from '@/components/home/CategoryGrid.vue'
import { actualizarVencimientos } from '@/services/ofertaService.js'
import OfertasCarousel from '@/components/home/OfertasCarousel.vue'
import CursoCarousel from '@/components/home/CursoCarousel.vue'

onMounted(async () => {
  try {
    await actualizarVencimientos()
    console.log("Vencimientos actualizados desde el Home")
  } catch (error) {
    console.error("No se pudieron actualizar los vencimientos en el Home:", error)
  }
})

</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
<template>
  <div class="min-h-screen bg-[#fffffd]">
    
    <HeroSection />
    <CategoryGrid />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CategoryGrid from '@/components/home/CategoryGrid.vue'

</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
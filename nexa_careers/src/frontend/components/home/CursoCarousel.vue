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

    <div 
      ref="carouselRef"
      class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 -mx-2"
    >
      <CursoCard 
        v-for="curso in cursos" 
        :key="curso.id" 
        :curso="curso"
        class="snap-start"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import CursoCard from './CursoCard.vue'

const carouselRef = ref(null)

const cursos = ref([
  {
    id: 1,
    nombre_curso: "Desarrollo Web Moderno con Vue 3",
    descripcion: "Aprende de cero a experto la composición API, gestión de estado global y despliegue optimizado.",
    fecha_inicio: "2026-06-15"
  },
  {
    id: 2,
    nombre_curso: "Arquitectura de Microservicios con Node.js",
    descripcion: "Diseña sistemas escalables, tolerantes a fallos y domina la comunicación asíncrona entre servicios.",
    fecha_inicio: "2026-06-22"
  },
  {
    id: 3,
    nombre_curso: "Fundamentos de Ciberseguridad y Sistemas SGSI",
    descripcion: "Introduce los estándares internacionales de seguridad de la información y protección de activos digitales.",
    fecha_inicio: "2026-07-01"
  },
  {
    id: 4,
    nombre_curso: "Base de Datos Avanzadas y Optimización de Consultas",
    descripcion: "Domina el modelado complejo, indexación y alta disponibilidad utilizando PostgreSQL y Supabase.",
    fecha_inicio: "2026-07-10"
  }
])

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
<template>
    <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Ofertas Destacadas</h2>
                <p class="mt-1 text-sm text-gray-500">Explora las últimas oportunidades disponibles.</p>
            </div>

            <div class="flex space-x-2">
                <button @click="scroll('left')"
                    class="p-2 rounded-full border border-[#1B2A4A] bg-[#1B2A4A] text-white hover:bg-[#b5943a] hover:border-[#b5943a] transition-colors duration-300">
                    ←
                </button>

                <button @click="scroll('right')"
                    class="p-2 rounded-full border border-[#1B2A4A] bg-[#1B2A4A] text-white hover:bg-[#b5943a] hover:border-[#b5943a] transition-colors duration-300">
                    →
                </button>
            </div>
        </div>

        <div ref="carouselRef" class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 -mx-2">
            <OfertaCard v-for="oferta in ofertas" :key="oferta.id" :oferta="oferta" class="snap-start" />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import OfertaCard from './OfertaCard.vue'

const carouselRef = ref(null)

// Datos de prueba
const ofertas = ref([
    {
        id: 1,
        titulo: "Desarrollador Frontend Vue.js",
        descripcion: "Buscamos un desarrollador apasionado por crear interfaces dinámicas, limpias y altamente optimizadas.",
        fecha_apertura: "2026-05-25",
        modalidad: "Remoto"
    },
    {
        id: 2,
        titulo: "Fullstack Developer (Node.js & PHP)",
        descripcion: "Únete a nuestro equipo para mantener y escalar plataformas críticas con microservicios robustos.",
        fecha_apertura: "2026-05-28",
        modalidad: "Híbrido"
    },
    {
        id: 3,
        titulo: "Especialista en Ciberseguridad / SGSI",
        descripcion: "Auditoría, implementación de normativas de seguridad de la información y reingeniería de sistemas.",
        fecha_apertura: "2026-05-20",
        modalidad: "Presencial"
    },
    {
        id: 4,
        titulo: "Diseñador UI/UX & Maquetador",
        descripcion: "Diseño de wireframes, flujos de usuario y prototipado interactivo listo para desarrollo.",
        fecha_apertura: "2026-05-15",
        modalidad: "Remoto"
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
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

        <div v-if="loading" class="text-center py-12">
            <p class="text-gray-500">Cargando ofertas...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
            <p class="text-red-500">{{ error }}</p>
        </div>

        <div v-else-if="ofertas.length === 0" class="text-center py-12">
            <p class="text-gray-500">No hay ofertas disponibles en este momento.</p>
        </div>

        <div v-else ref="carouselRef" class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 -mx-2">
            <OfertaCard v-for="oferta in ofertas" :key="oferta.id_oferta || oferta.id" :oferta="oferta" class="snap-start" />
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import OfertaCard from './OfertaCard.vue'
import { obtenerOfertasPaginacionPorEstadoYFecha } from '@/services/ofertaService'

const carouselRef = ref(null)
const ofertas = ref([])
const loading = ref(true)
const error = ref(null)

// Obtener ofertas con fecha de apertura más próxima (descendente) con estado 1 (aceptado)
const cargarOfertas = async () => {
    try {
        loading.value = true
        error.value = null
        // Obtener la primera página de ofertas con estado 1, ordenadas por fecha más próxima
        const response = await obtenerOfertasPaginacionPorEstadoYFecha(1, 1, 8)
        
        if (response.success && response.data) {
            ofertas.value = response.data
        } else {
            error.value = 'No se pudieron cargar las ofertas'
            ofertas.value = []
        }
    } catch (err) {
        console.error('Error al cargar ofertas:', err)
        error.value = err.message
        ofertas.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    cargarOfertas()
})

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
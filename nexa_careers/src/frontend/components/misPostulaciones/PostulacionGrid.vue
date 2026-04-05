<template>
    <div>
        <div v-if="loading" class="text-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D1B16D] mx-auto mb-4"></div>
            <p class="text-gray-400">Cargando tus postulaciones...</p>
        </div>

        <div v-else-if="postulaciones.length === 0"
            class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-lg">
            <span class="text-6xl mb-6 block">📂</span>
            <h3 class="text-2xl font-bold text-[#002349]">No tienes postulaciones aún</h3>
            <p class="text-gray-500 mt-2 max-w-md mx-auto">
                ¿Qué esperas? Explora el catálogo de ofertas y encuentra tu próxima gran oportunidad laboral.
            </p>
            <router-link to="/ofertas"
                class="mt-8 inline-block bg-[#002349] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#001a35] transition-colors">
                Explorar Ofertas
            </router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PostulacionCard v-for="item in postulaciones" :key="item.id" :postulacion="item" />
        </div>
    </div>
</template>

<script setup>
import PostulacionCard from './PostulacionCard.vue';

defineProps({
    postulaciones: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});
</script>
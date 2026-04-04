<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando curso...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20 text-red-400">
        <p class="text-5xl mb-4">⚠️</p>
        <p class="text-lg font-medium">{{ error }}</p>
        <router-link to="/cursos" class="text-sm text-[#2e6da4] hover:underline mt-3 inline-block">
          ← Volver al catálogo
        </router-link>
      </div>

      <!-- Contenido -->
      <template v-else-if="curso">

        <DetalleCursoHeader :curso="curso" />

        <div class="flex flex-col lg:flex-row gap-6 items-start">

          <!-- Columna principal -->
          <div class="flex-1 min-w-0">
            <DetalleCursoInfo     :curso="curso" />
            <DetalleCursoContacto :curso="curso" />
          </div>

          <!-- Sidebar -->
          <div class="w-full lg:w-72 flex-shrink-0">
            <DetalleCursoSidebar :curso="curso" />
          </div>

        </div>

      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { obtenerCursoPorId } from '../services/cursoService.js'
import DetalleCursoHeader   from '../components/detalleCurso/DetalleCursoHeader.vue'
import DetalleCursoInfo     from '../components/detalleCurso/DetalleCursoInfo.vue'
import DetalleCursoContacto from '../components/detalleCurso/DetalleCursoContacto.vue'
import DetalleCursoSidebar  from '../components/detalleCurso/DetalleCursoSidebar.vue'

const route  = useRoute()
const curso  = ref(null)
const loading = ref(true)
const error   = ref(null)

onMounted(async () => {
  try {
    const response = await obtenerCursoPorId(route.params.id)
    if (response.success) {
      curso.value = response.data
    } else {
      error.value = 'No se encontró el curso solicitado.'
    }
  } catch (e) {
    console.error('Error al cargar el curso:', e)
    error.value = 'No se pudo cargar el curso. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
})
</script>
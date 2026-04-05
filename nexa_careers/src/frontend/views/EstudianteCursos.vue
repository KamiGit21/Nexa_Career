<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Cursos</h1>
          <p class="text-gray-500 mt-1">Cursos que has publicado en la plataforma</p>
        </div>
        <router-link
          to="/publicar-curso"
          class="px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium flex items-center gap-2 hover:bg-[#0f1a2e] transition-colors">
          + Publicar Curso
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando tus cursos...
      </div>

      <div v-else-if="cursos.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-5xl mb-4">📭</p>
        <p class="text-lg font-medium">Aún no has publicado ningún curso</p>
        <p class="text-sm mt-1">Cuando publiques uno aparecerá aquí</p>
        <router-link
          to="/publicar-curso"
          class="inline-block mt-6 px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium hover:bg-[#0f1a2e] transition-colors">
          + Publicar Curso
        </router-link>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="curso in cursos"
          :key="curso.id_curso"
          class="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition duration-300"
        >
          <!-- Estado badge -->
          <div class="flex justify-between items-start mb-3">
            <h2 class="text-xl font-semibold text-[#1b2a4a] leading-tight">
              {{ curso.curso }}
            </h2>
            <span
              class="text-xs px-3 py-1 rounded-full font-semibold ml-2 flex-shrink-0"
              :class="{
                'bg-yellow-100 text-yellow-700': curso.estado === 0,
                'bg-green-100 text-green-700': curso.estado === 1,
                'bg-red-100 text-red-700': curso.estado === 2,
                'bg-gray-100 text-gray-500': curso.estado === 3
              }"
            >
              {{ ['Pendiente','Aceptado','Rechazado','Archivado'][curso.estado] ?? 'Desconocido' }}
            </span>
          </div>

          <p class="text-gray-500 text-sm mb-4 line-clamp-3">
            {{ curso.descripcion || 'Sin descripción' }}
          </p>

          <div class="text-sm text-gray-600 space-y-1">
            <p><span class="font-medium">Contacto:</span> {{ curso.contacto || 'No especificado' }}</p>
            <p><span class="font-medium">Fecha:</span> {{ formatearFecha(curso.fecha_creacion) }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarCursosPorEstudiante } from '../services/cursoService.js'

const router = useRouter()
const cursos = ref([])
const loading = ref(true)

const formatearFecha = (fecha) => {
  if (!fecha) return 'No especificada'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const cargarCursos = async () => {
  loading.value = true
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
    if (!sesion.id || sesion.rol !== 'estudiante') {
      router.push('/login')
      return
    }
    const response = await listarCursosPorEstudiante(sesion.id)
    if (response.success) {
      cursos.value = response.data || []
    }
  } catch (error) {
    console.error('Error al cargar cursos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(cargarCursos)
</script>
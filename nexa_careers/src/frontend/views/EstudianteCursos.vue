<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <div class="max-w-7xl mx-auto px-6 py-10">

      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Cursos</h1>
          <p class="text-gray-500 mt-1">
            Cursos en los que estás inscrito
          </p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando tus cursos...
      </div>

      <div v-else-if="cursos.length === 0" class="text-center py-20 text-gray-500">
        Aún no estás inscrito en ningún curso.
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="curso in cursos"
          :key="curso.id_curso"
          class="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition duration-300"
        >

          <h2 class="text-xl font-semibold text-[#1b2a4a] mb-2">
            {{ curso.titulo }}
          </h2>

          <p class="text-gray-500 text-sm mb-4 line-clamp-3">
            {{ curso.descripcion }}
          </p>

          <div class="text-sm text-gray-600 space-y-1 mb-4">
            <p><span class="font-medium">Categoría:</span> {{ curso.categoria || 'General' }}</p>
            <p><span class="font-medium">Inicio:</span> {{ formatearFecha(curso.fecha_inicio) }}</p>
            <p><span class="font-medium">Duración:</span> {{ curso.duracion || 'No definida' }}</p>
          </div>

          <div class="flex justify-between items-center mt-4">

            <span
              class="text-xs px-3 py-1 rounded-full font-medium"
              :class="curso.estado === 'En progreso'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'"
            >
              {{ curso.estado || 'Activo' }}
            </span>

            <div class="flex gap-2">
              <button
                class="px-3 py-1 bg-[#1b2a4a] text-white rounded-lg text-sm hover:bg-[#0f1a2e]"
              >
                Ver
              </button>

              <button
                class="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Salir
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listarCursosPorEstudiante } from '../services/cursoService.js'

const cursos = ref([])
const loading = ref(true)

const formatearFecha = (fecha) => {
  if (!fecha) return 'No especificada'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const cargarCursos = async () => {
  loading.value = true

  

  try {
    const sesion = JSON.parse(localStorage.getItem('sesion'))

    if (!sesion || sesion.rol !== 'estudiante') {
      console.log('No autorizado')
      return
    }

    const idEstudiante = sesion.id

    const response = await listarCursosPorEstudiante(idEstudiante)

    // para el back porsia
    cursos.value = response.data || response || []

  } catch (error) {
    console.error('Error al cargar cursos:', error)
    cursos.value = []
  } finally {
    loading.value = false
  }
}

onMounted(cargarCursos)
</script>
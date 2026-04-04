<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <div class="max-w-7xl mx-auto px-6 py-10">

      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Cursos</h1>
          <p class="text-gray-500 mt-1">
            Gestiona cursos que has publicado
          </p>
        </div>

        <button
          class="px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium hover:bg-[#0f1a2e] transition">
          + Nuevo Curso
        </button>
      </div>
      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando tus cursos...
      </div>
      <div v-else-if="cursos.length === 0" class="text-center py-20 text-gray-500">
        Aún no tienes cursos publicados.
      </div>

      <!-- en forma de card -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="curso in cursos"
          :key="curso.id_curso"
          class="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition duration-300">

          <!-- titulo -->
          <h2 class="text-xl font-semibold text-[#1b2a4a] mb-2">
            {{ curso.titulo }}
          </h2>

          <!-- descrip -->
          <p class="text-gray-500 text-sm mb-4 line-clamp-3">
            {{ curso.descripcion }}
          </p>

          <!-- sobre el curso -->
          <div class="text-sm text-gray-600 space-y-1 mb-4">
            <p><span class="font-medium">Categoría:</span> {{ curso.categoria || 'General' }}</p>
            <p><span class="font-medium">Fecha:</span> {{ formatearFecha(curso.fecha_creacion) }}</p>
            <p><span class="font-medium">Duración:</span> {{ curso.duracion || 'No definida' }}</p>
          </div>

          <div class="flex justify-between items-center mt-4">

            <span
              class="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              Activo
            </span>

            <div class="flex gap-2">
              <button
                class="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                Editar
              </button>

              <button
                class="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                Eliminar
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
// import { listarCursosPorEmpleador } from '../services/cursoService.js'

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

    if (!sesion || sesion.rol !== 'empleador') {
      console.log('No autorizado')
      return
    }

    const idEmpleador = sesion.id

    // mini ejemplo de vista
    cursos.value = [
      {
        id_curso: 1,
        titulo: 'Curso de Vue.js',
        descripcion: 'Aprende Vue 3',
        categoria: 'Frontend',
        fecha_creacion: '2025-04-01',
        duracion: '4 semanas'
      }
    ]

  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(cargarCursos)
</script>
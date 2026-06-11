<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-5xl mx-auto px-6 py-10">
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-[#1b2a4a] mb-8">
        ← Volver
      </button>

      <div v-if="loading" class="text-center py-20 font-medium text-gray-600">
        Cargando perfil del estudiante...
      </div>

      <div v-else-if="error" class="text-center py-20 text-red-600">
        {{ error }}
      </div>

      <div v-else class="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-[#1b2a4a] to-[#002349] px-12 py-8 text-white">
          <h1 class="text-4xl font-bold">{{ estudiante.nombre }} {{ estudiante.apellido }}</h1>
          <p class="font-medium text-[#d0b06d] text-xl mt-1">Estudiante</p>

          <div class="flex items-center gap-2 mt-2">
            <span class="text-l font-small">
              {{ estudiante.nombre_carrera || 'Carrera no especificada' }}
            </span>
          </div>

          <div class="flex gap-3 mt-4">
            <span :class="estudiante.activo ? 'bg-green-500' : 'bg-red-500'"
              class="px-3 py-1 rounded-full text-xs uppercase font-bold text-white">
              {{ estudiante.activo ? 'Activo' : 'Inactivo' }}
            </span>
            <span v-if="ofertaId" class="bg-blue-500 px-3 py-1 rounded-full text-xs uppercase font-bold text-white">
              Postulante ID: {{ estudiante.id_estudiante }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
            <div class="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div class="w-12 h-12 bg-[#1b2a4a]/5 rounded-xl flex items-center justify-center text-2xl">
                💼
              </div>
              <div>
                <p class="text-2xl font-black text-[#1b2a4a]">{{ stats.total_cursos }}</p>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cursos Publicados</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-10 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div class="space-y-8">
            <section>
              <h3 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-wider">Contacto</h3>
              <p class="mt-3 text-gray-600 flex items-center gap-2 text-sm md:text-base">📧 {{ estudiante.gmail }}</p>
              <p class="text-gray-600 flex items-center gap-2 text-sm md:text-base">📞 {{ estudiante.telefono }}</p>
            </section>

            <section v-if="estudiante.cv">
              <h3 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-wider">Documentos</h3>
              <a :href="urlCV" target="_blank"
                class="mt-3 inline-block px-4 py-2 bg-[#d0b06d] text-white rounded-lg hover:bg-[#b0905d] transition font-semibold">
                📄 Ver Currículum PDF
              </a>
            </section>
          </div>

          <div class="md:col-span-2 space-y-8">
            <section>
              <h3 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-wider">Sobre mí</h3>
              <p class="mt-3 text-gray-700 leading-relaxed">{{ estudiante.descripcion || 'Sin descripción disponible.'
              }}</p>
            </section>

            <section>
              <h3 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-wider">Educación</h3>
              <p class="mt-3 text-gray-700">{{ estudiante.educacion || 'No especificada.' }}</p>
            </section>

            <section>
              <h3 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-wider">Habilidades</h3>
              <div class="flex flex-wrap gap-2 mt-3">
                <span v-for="skill in (estudiante.habilidades?.split(',') || [])" :key="skill"
                  class="px-3 py-1 bg-gray-100 text-[#1b2a4a] rounded-full text-sm font-medium border border-gray-200">
                  {{ skill.trim() }}
                </span>
              </div>
            </section>

            <div v-if="ofertaId && estudiante.estadoPostulacion === 0" class="pt-8 flex gap-4 border-t border-gray-100">
              <button @click="cambiarEstado(1)"
                class="flex-1 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition">
                Aceptar Postulante
              </button>
              <button @click="cambiarEstado(2)"
                class="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition">
                Rechazar Postulante
              </button>
            </div>

            <div v-else-if="ofertaId" class="pt-8 border-t border-gray-100">
              <p class="text-center font-bold p-4 rounded-xl"
                :class="estudiante.estadoPostulacion === 1 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                Estado de postulación: {{ estudiante.estadoPostulacion === 1 ? 'ACEPTADO' : 'RECHAZADO' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router' // Se añadió useRouter aquí

import * as estudianteService from '@/services/estudianteService'
import { obtenerCarreraPorId } from '@/services/carreraService'
import { contarCursosEstudiante } from '@/services/cursoService'

const route = useRoute()
const router = useRouter() // Ahora sí funcionará
const loading = ref(true)
const error = ref(null)

const estudiante = ref({
  id_estudiante: null,
  nombre: '',
  apellido: '',
  gmail: '',
  telefono: '',
  id_carrera: null,
  nombre_carrera: '',
  educacion: '',
  habilidades: '',
  descripcion: '',
  cv: '',
  activo: false,
  estadoPostulacion: 0,
  id_ofertante: null
})

const stats = ref({
  total_cursos: 0,
})

const urlCV = computed(() => {
  if (!estudiante.value.id_estudiante) return '#'
  return estudianteService.obtenerUrlVisorCV(estudiante.value.id_estudiante)
})

const ofertaId = ref(route.query.ofertaId || null)

const cargarPostulante = async () => {
  loading.value = true
  error.value = null

  try {
    const estudianteId = route.params.id
    if (!estudianteId) throw new Error('ID de estudiante no válido')

    const dataEst = await estudianteService.obtenerEstudiantePorId(estudianteId)

    if (!dataEst.success) throw new Error(dataEst.message || 'Error al cargar estudiante')

    Object.assign(estudiante.value, dataEst.data)

    if (estudiante.value.id_carrera) {
      try {
        const dataCarrera = await obtenerCarreraPorId(estudiante.value.id_carrera);
        if (dataCarrera && dataCarrera.success && dataCarrera.data) {
          estudiante.value.nombre_carrera = dataCarrera.data.carrera || dataCarrera.data.nombre;
        }
      } catch (err) {
        console.error('Error al cargar la información de la carrera:', err);
      }
    }

    try {
      const dataCursos = await contarCursosEstudiante(estudianteId);
      if (dataCursos && dataCursos.success && dataCursos.data) {
        stats.value.total_cursos = dataCursos.data.total;
      }
    } catch (err) {
      console.error('Error al cargar el total de cursos del estudiante:', err);
      stats.value.total_cursos = 0;
    }

    // Si hay ofertaId, verificar estado de postulación en puerto 3004
    if (ofertaId.value) {
      const resOf = await fetch(`http://localhost:3004/api/ofertantes/buscar?id_oferta=${ofertaId.value}&id_estudiante=${estudianteId}`)
      const dataOf = await resOf.json()

      if (dataOf.success && dataOf.data) {
        estudiante.value.estadoPostulacion = dataOf.data.estado
        estudiante.value.id_ofertante = dataOf.data.id_ofertante
      }
    }

  } catch (e) {
    console.error('Error:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const cambiarEstado = async (nuevoEstado) => {
  try {
    if (!estudiante.value.id_ofertante) throw new Error('No se encontró la postulación')

    const response = await fetch(`http://localhost:3004/api/ofertantes/${estudiante.value.id_ofertante}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    })

    const data = await response.json()
    if (!data.success) throw new Error(data.message)

    estudiante.value.estadoPostulacion = nuevoEstado
    alert(nuevoEstado === 1 ? 'Postulante aceptado exitosamente' : 'Postulante rechazado exitosamente')

    setTimeout(() => {
      router.push(`/mis-ofertas/${ofertaId.value}/postulantes`)
    }, 500)

  } catch (e) {
    alert(e.message || 'Error al procesar la solicitud')
  }
}

onMounted(cargarPostulante)
</script>
<!-- C:\xampp\htdocs\Nexa_Career\nexa_careers\src\frontend\views\EstudianteCursos.vue -->
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

      <!-- Filtros por búsqueda, categoría y estado -->
      <MisCursosFiltros
        v-model:busqueda="busqueda"
        v-model:categoriaFiltro="categoriaFiltro"
        v-model:estadoFiltro="estadoFiltro"
        :categorias="categorias"
      />

      <div v-if="loading" class="text-center py-20 text-gray-500">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b2a4a] mx-auto mb-4"></div>
        Cargando tus cursos...
      </div>

      <div v-else-if="cursosFiltrados.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-5xl mb-4">📭</p>
        <p class="text-lg font-medium">
          {{ hayFiltrosActivos ? 'No hay cursos con estos filtros' : 'Aún no has publicado ningún curso' }}
        </p>
        <p class="text-sm mt-1">
          {{ hayFiltrosActivos ? 'Prueba con otros filtros' : 'Cuando publiques uno aparecerá aquí' }}
        </p>
        <router-link
          v-if="!hayFiltrosActivos"
          to="/publicar-curso"
          class="inline-block mt-6 px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium hover:bg-[#0f1a2e] transition-colors">
          + Publicar Curso
        </router-link>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="curso in cursosFiltrados"
          :key="curso.id_curso"
          class="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition duration-300 flex flex-col h-full"
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

          <!-- Categorías del curso -->
          <div v-if="curso.categorias && curso.categorias.length > 0" class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="cat in curso.categorias"
              :key="cat.id_categoria"
              class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
            >
              {{ cat.categoria }}
            </span>
          </div>
          <div v-else class="mb-3">
            <span class="text-xs text-gray-400">Sin categorías</span>
          </div>

          <p class="text-gray-500 text-sm mb-3 line-clamp-3" :class="curso.estado === 2 ? '' : 'flex-grow'">
  {{ curso.descripcion || 'Sin descripción' }}
</p>

<MotivoRechazoBanner
  v-if="curso.estado === 2"
  :motivo="curso.rechazo"
  class="mb-3 flex-grow"
/>

          <div class="text-sm text-gray-600 space-y-1 mb-4">
            <p><span class="font-medium">Contacto:</span> {{ curso.contacto || 'No especificado' }}</p>
            <p><span class="font-medium">Fecha:</span> {{ formatearFecha(curso.fecha_creacion) }}</p>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-gray-100">
            <button
              @click="verDetalle(curso)"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
            >
              Ver detalles
            </button>
            <button
              @click="editarCurso(curso)"
              class="text-sm text-green-600 hover:text-green-800 font-medium transition"
            >
              Editar
            </button>

            <div class="flex-grow"></div>

            <button
              v-if="curso.estado !== 3"
              @click="abrirModalBaja(curso)"
              class="text-sm text-red-500 hover:text-red-700 font-medium transition"
            >
              Dar de baja
            </button>
            <button
              v-if="curso.estado === 3"
              @click="abrirModalDesarchivar(curso)"
              class="text-sm text-yellow-600 hover:text-yellow-800 font-medium transition"
            >
              Desarchivar
            </button>
          </div>
        </div>
      </div>

    </div>

    <ConfirmarBajaCursoModal
      :visible="modalBajaVisible"
      :nombre-curso="cursoSeleccionado?.curso || ''"
      :cargando="procesando"
      @cancelar="cerrarModales"
      @confirmar="confirmarBaja"
    />

    <DesarchivarCursoModal
      :visible="modalDesarchivarVisible"
      :nombre-curso="cursoSeleccionado?.curso || ''"
      :cargando="procesando"
      @cancelar="cerrarModales"
      @confirmar="confirmarDesarchivar"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import MotivoRechazoBanner from '../components/comunes/MotivoRechazoBanner.vue'
// Importaciones de modales y servicios
import ConfirmarBajaCursoModal from '../components/misCursos/ConfirmarBajaCursoModal.vue'
import DesarchivarCursoModal from '../components/misCursos/DesarchivarCursoModal.vue'
import MisCursosFiltros from '../components/misCursos/MisCursosFiltros.vue'
import {
  listarCursosPorEstudiante,
  listarCategorias,
  archivarCurso,
  desarchivarCurso
} from '../services/cursoService.js'

const router = useRouter()
const cursos = ref([])
const categorias = ref([])
const busqueda = ref('')
const categoriaFiltro = ref(null)
const estadoFiltro = ref(null)
const loading = ref(true)

const modalBajaVisible = ref(false)
const modalDesarchivarVisible = ref(false)
const cursoSeleccionado = ref(null)
const procesando = ref(false)

const hayFiltrosActivos = computed(() =>
  !!busqueda.value || !!categoriaFiltro.value || estadoFiltro.value !== null
)

const cursosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()
  return cursos.value.filter(curso => {
    const porTexto = !texto ||
      curso.curso?.toLowerCase().includes(texto) ||
      curso.descripcion?.toLowerCase().includes(texto)
    const porCategoria = !categoriaFiltro.value ||
      (curso.categorias && curso.categorias.some(cat => cat.id_categoria === categoriaFiltro.value))
    const porEstado = estadoFiltro.value === null || curso.estado === estadoFiltro.value
    return porTexto && porCategoria && porEstado
  })
})

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

const cargarCategorias = async () => {
  try {
    const response = await listarCategorias()
    if (response.success) {
      categorias.value = response.data || []
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

const verDetalle = (curso) => router.push(`/cursos/${curso.id_curso}`)
const editarCurso = (curso) => router.push(`/editar-curso/${curso.id_curso}`)

const cerrarModales = () => {
  modalBajaVisible.value = false
  modalDesarchivarVisible.value = false
  cursoSeleccionado.value = null
}

const abrirModalBaja = (curso) => {
  cursoSeleccionado.value = curso
  modalBajaVisible.value = true
}

const abrirModalDesarchivar = (curso) => {
  cursoSeleccionado.value = curso
  modalDesarchivarVisible.value = true
}

const confirmarBaja = async () => {
  procesando.value = true
  try {
    const res = await archivarCurso(cursoSeleccionado.value.id_curso)
    if (res.success) {
      const idx = cursos.value.findIndex(c => c.id_curso === cursoSeleccionado.value.id_curso)
      if (idx !== -1) cursos.value[idx].estado = 3
      cerrarModales()
    } else {
      alert(res.message || 'No se pudo dar de baja el curso.')
    }
  } catch {
    alert('Error de conexión.')
  } finally {
    procesando.value = false
  }
}

const confirmarDesarchivar = async () => {
  procesando.value = true
  try {
    const res = await desarchivarCurso(cursoSeleccionado.value.id_curso)
    if (res.success) {
      const idx = cursos.value.findIndex(c => c.id_curso === cursoSeleccionado.value.id_curso)
      if (idx !== -1) cursos.value[idx].estado = 0
      cerrarModales()
    } else {
      alert(res.message || 'No se pudo desarchivar el curso.')
    }
  } catch {
    alert('Error de conexión.')
  } finally {
    procesando.value = false
  }
}

onMounted(() => {
  cargarCursos()
  cargarCategorias()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
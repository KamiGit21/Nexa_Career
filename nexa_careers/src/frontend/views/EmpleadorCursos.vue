<!-- C:\xampp\htdocs\Nexa_Career\nexa_careers\src\frontend\views\EmpleadorCursos.vue -->
<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Cursos</h1>
          <p class="text-gray-500 mt-1">Gestiona cursos que has publicado</p>
        </div>
        <router-link
          to="/publicar-curso"
          class="px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium hover:bg-[#0f1a2e] transition">
          + Nuevo Curso
        </router-link>
      </div>

      <!-- === NUEVO: FILTRO POR CATEGORÍAS === -->
      <div class="mb-6 bg-white rounded-2xl p-4 shadow-sm">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-sm font-medium text-gray-600">Filtrar por categoría:</span>
          
          <!-- Select / Combo box de categorías -->
          <select 
            v-model="categoriaFiltro"
            class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:border-transparent bg-white"
          >
            <option :value="null">Todas las categorías</option>
            <option 
              v-for="cat in categorias" 
              :key="cat.id_categoria" 
              :value="cat.id_categoria"
            >
              {{ cat.categoria }}
            </option>
          </select>

          <!-- Mostrar categorías seleccionadas del curso actual (si el curso tiene categorías) -->
          <div v-if="categoriaFiltro" class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Filtrando por:</span>
            <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {{ nombreCategoriaSeleccionada }}
              <button @click="categoriaFiltro = null" class="hover:text-blue-900">✕</button>
            </span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando tus cursos...
      </div>

      <div v-else-if="cursosFiltrados.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-5xl mb-4">📭</p>
        <p class="text-lg font-medium">
          {{ categoriaFiltro ? 'No hay cursos en esta categoría' : 'Aún no has publicado ningún curso' }}
        </p>
        <p class="text-sm mt-1">
          {{ categoriaFiltro ? 'Prueba con otra categoría' : 'Cuando publiques uno aparecerá aquí' }}
        </p>
        <router-link 
          v-if="!categoriaFiltro"
          to="/publicar-curso"
          class="inline-block mt-6 px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium hover:bg-[#0f1a2e] transition-colors">
          + Publicar Curso
        </router-link>
      </div>


      <CursoGrid
        v-else
        :cursos="cursos"
        @editar="handleEditar"
        @dar-de-baja="abrirModalBaja"
      />

      <!-- Cards de cursos -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="curso in cursosFiltrados"
          :key="curso.id_curso"
          class="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition duration-300">

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

          <!-- Mostrar categorías del curso -->
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

          <p class="text-gray-500 text-sm mb-4 line-clamp-3">
            {{ curso.descripcion || 'Sin descripción' }}
          </p>

          <div class="text-sm text-gray-600 space-y-1 mb-4">
            <p><span class="font-medium">Contacto:</span> {{ curso.contacto || 'No especificado' }}</p>
            <p><span class="font-medium">Fecha:</span> {{ formatearFecha(curso.fecha_creacion) }}</p>
          </div>

          <!-- === NUEVO: BOTONES DE ACCIÓN === -->
          <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              @click="verDetalle(curso)"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver detalles
            </button>
            <button
              @click="editarCurso(curso)"
              class="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Editar
            </button>
          </div>

        </div>
      </div>

    </div>

    <!-- NUEVO: solo el modal -->
    <ConfirmarBajaCursoModal
      :visible="modalVisible"
      :nombre-curso="cursoSeleccionado?.curso || ''"
      :cargando="procesando"
      @cancelar="cerrarModal"
      @confirmar="confirmarBaja"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import { listarCursosPorEmpleador } from '../services/cursoService.js'
import CursoGrid               from '../components/misCursos/CursoGrid.vue'
import { listarCursosPorEmpleador, listarCategorias } from '../services/cursoService.js'
import ConfirmarBajaCursoModal from '../components/misCursos/ConfirmarBajaCursoModal.vue' // NUEVO

const modalVisible      = ref(false)
const cursoSeleccionado = ref(null)
const procesando        = ref(false)



const router = useRouter()
const cursos = ref([])
const categorias = ref([])
const categoriaFiltro = ref(null)
const loading = ref(true)

// Cursos filtrados por categoría
const cursosFiltrados = computed(() => {
  if (!categoriaFiltro.value) {
    return cursos.value
  }
  return cursos.value.filter(curso => {
    // Verificar si el curso tiene la categoría seleccionada
    return curso.categorias && curso.categorias.some(cat => cat.id_categoria === categoriaFiltro.value)
  })
})

// Nombre de la categoría seleccionada para mostrar
const nombreCategoriaSeleccionada = computed(() => {
  if (!categoriaFiltro.value) return ''
  const cat = categorias.value.find(c => c.id_categoria === categoriaFiltro.value)
  return cat ? cat.categoria : ''
})

const formatearFecha = (fecha) => {
  if (!fecha) return 'No especificada'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const cargarCursos = async () => {
  loading.value = true
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
    if (!sesion.id || sesion.rol !== 'empleador') { router.push('/login'); return }
    const response = await listarCursosPorEmpleador(sesion.id)
    if (response.success) cursos.value = response.data || []
  } catch (error) {
    console.error('Error al cargar cursos:', error)
  } finally {
    loading.value = false
  }
}


const handleEditar   = (curso) => console.log('Editar curso:', curso.id_curso)
const abrirModalBaja = (curso) => { cursoSeleccionado.value = curso; modalVisible.value = true }
const cerrarModal    = ()      => { modalVisible.value = false; cursoSeleccionado.value = null }
const confirmarBaja  = async () => {
  procesando.value = true
  try {
    const idx = cursos.value.findIndex(c => c.id_curso === cursoSeleccionado.value.id_curso)
    if (idx !== -1) cursos.value[idx].estado = 3
    cerrarModal()
  } finally {
    procesando.value = false
  }
}

onMounted(cargarCursos)

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

// === NUEVAS FUNCIONES ===
const verDetalle = (curso) => {
  router.push(`/detalle-curso/${curso.id_curso}`)
}

const editarCurso = (curso) => {
  router.push(`/editar-curso/${curso.id_curso}`)
}

onMounted(() => {
  cargarCursos()
  cargarCategorias()
})
</script>
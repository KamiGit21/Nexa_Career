<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Cursos</h1>
          <p class="text-gray-500 mt-1">Cursos que has publicado en la plataforma</p>
        </div>
        <router-link to="/publicar-curso"
          class="px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium flex items-center gap-2 hover:bg-[#0f1a2e] transition-colors">
          + Publicar Curso
        </router-link>
      </div>

      <MisCursosFiltros
        v-model:categoriaFiltro="categoriaFiltro"
        v-model:estadoFiltro="estadoFiltro"
        :categorias="categorias"
      />

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando tus cursos...
      </div>

      <CursosVacio v-else-if="cursos.length === 0" />

      <template v-else>
        <div v-if="cursosFiltrados.length === 0" class="text-center py-20 text-gray-400">
          <p class="text-5xl mb-4">📭</p>
          <p class="text-lg font-medium">No hay cursos con los filtros aplicados</p>
          <p class="text-sm mt-1">Prueba con otros filtros</p>
        </div>

        <CursoGrid
          v-else
          :cursos="cursosFiltrados"
          @editar="handleEditar"
          @dar-de-baja="abrirModalBaja"
          @desarchivar="abrirModalDesarchivar"
        />
      </template>

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
import CursoGrid from '../components/misCursos/CursoGrid.vue'
import CursosVacio from '../components/misCursos/CursosVacio.vue'
import MisCursosFiltros from '../components/misCursos/MisCursosFiltros.vue'
import ConfirmarBajaCursoModal from '../components/misCursos/ConfirmarBajaCursoModal.vue'
import DesarchivarCursoModal from '../components/misCursos/DesarchivarCursoModal.vue'
import {
  listarCursosPorEstudiante,
  listarCategorias,
  archivarCurso,
  desarchivarCurso
} from '../services/cursoService.js'

const router = useRouter()
const cursos = ref([])
const categorias = ref([])
const categoriaFiltro = ref(null)
const estadoFiltro = ref(null)
const loading = ref(true)
const modalBajaVisible = ref(false)
const modalDesarchivarVisible = ref(false)
const cursoSeleccionado = ref(null)
const procesando = ref(false)

const cursosFiltrados = computed(() =>
  cursos.value.filter(curso => {
    const matchCategoria = !categoriaFiltro.value ||
      curso.categorias?.some(cat => cat.id_categoria === categoriaFiltro.value)
    const matchEstado = estadoFiltro.value === null || curso.estado === estadoFiltro.value
    return matchCategoria && matchEstado
  })
)

const cargarCursos = async () => {
  loading.value = true
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
    if (!sesion.id || sesion.rol !== 'estudiante') { router.push('/login'); return }
    const res = await listarCursosPorEstudiante(sesion.id)
    if (res.success) cursos.value = res.data || []
  } catch (e) {
    console.error('Error al cargar cursos:', e)
  } finally {
    loading.value = false
  }
}

const cargarCategorias = async () => {
  try {
    const res = await listarCategorias()
    if (res.success) categorias.value = res.data || []
  } catch (e) {
    console.error('Error al cargar categorías:', e)
  }
}

const handleEditar = (curso) => router.push(`/editar-curso/${curso.id_curso}`)
const cerrarModales = () => { modalBajaVisible.value = false; modalDesarchivarVisible.value = false; cursoSeleccionado.value = null }
const abrirModalBaja = (curso) => { cursoSeleccionado.value = curso; modalBajaVisible.value = true }
const abrirModalDesarchivar = (curso) => { cursoSeleccionado.value = curso; modalDesarchivarVisible.value = true }

const confirmarBaja = async () => {
  procesando.value = true
  try {
    const res = await archivarCurso(cursoSeleccionado.value.id_curso)
    if (res.success) {
      const idx = cursos.value.findIndex(c => c.id_curso === cursoSeleccionado.value.id_curso)
      if (idx !== -1) cursos.value[idx].estado = 3
      cerrarModales()
    } else { alert(res.message || 'No se pudo dar de baja el curso.') }
  } catch { alert('Error de conexión.') }
  finally { procesando.value = false }
}

const confirmarDesarchivar = async () => {
  procesando.value = true
  try {
    const res = await desarchivarCurso(cursoSeleccionado.value.id_curso)
    if (res.success) {
      const idx = cursos.value.findIndex(c => c.id_curso === cursoSeleccionado.value.id_curso)
      if (idx !== -1) cursos.value[idx].estado = 0
      cerrarModales()
    } else { alert(res.message || 'No se pudo desarchivar el curso.') }
  } catch { alert('Error de conexión.') }
  finally { procesando.value = false }
}

onMounted(() => { cargarCursos(); cargarCategorias() })
</script>
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

      <CursosVacio v-else-if="cursos.length === 0" />

      <CursoGrid
        v-else
        :cursos="cursos"
        @editar="handleEditar"
        @dar-de-baja="abrirModalBaja"
      />

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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarCursosPorEstudiante } from '../services/cursoService.js'
import CursoGrid               from '../components/misCursos/CursoGrid.vue'
import CursosVacio             from '../components/misCursos/CursosVacio.vue'
import ConfirmarBajaCursoModal from '../components/misCursos/ConfirmarBajaCursoModal.vue' // NUEVO

const router  = useRouter()
const cursos  = ref([])
const loading = ref(true)

const modalVisible      = ref(false)
const cursoSeleccionado = ref(null)
const procesando        = ref(false)

const cargarCursos = async () => {
  loading.value = true
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
    if (!sesion.id || sesion.rol !== 'estudiante') { router.push('/login'); return }
    const response = await listarCursosPorEstudiante(sesion.id)
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
</script>
<template>
  <div class="gestion-cursos">
    <GestionCursosHeader :total="cursos.length" v-model:busqueda="busqueda" />
    <GestionCursosFiltros v-model:estadoFiltro="estadoFiltro" :conteos="conteos" />

    <div v-if="loading" class="gestion-cursos__estado">
      <p class="text-4xl mb-3 animate-pulse">⏳</p>
      <p>Cargando cursos...</p>
    </div>
    <div v-else-if="cursos.length === 0" class="gestion-cursos__estado">
      <p class="text-4xl mb-3">📭</p>
      <p>No hay cursos registrados</p>
    </div>
    <div v-else-if="cursosFiltrados.length === 0" class="gestion-cursos__estado">
      <p class="text-4xl mb-3">🔍</p>
      <p>No se encontraron cursos con ese filtro</p>
      <button @click="limpiarFiltros" class="btn-limpiar">Limpiar filtros</button>
    </div>
    <div v-else class="gestion-cursos__grid">
      <ModerarItemCard
        v-for="curso in cursosFiltrados"
        :key="curso.id_curso"
        :item="mapearCurso(curso)"
        :cargando="procesando === curso.id_curso"
        @accion="({ id, estado, rechazo }) => moderarCurso(id, estado, rechazo)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GestionCursosHeader  from '@/components/gestionCursos/GestionCursosHeader.vue'
import GestionCursosFiltros from '@/components/gestionCursos/GestionCursosFiltros.vue'
import ModerarItemCard       from '@/components/dashboardSupervisor/ModerarItemCard.vue'
import { listarTodosCursos, cambiarEstadoCurso } from '@/services/supervisorService.js'

const router       = useRouter()
const cursos       = ref([])
const loading      = ref(true)
const procesando   = ref(null)
const busqueda     = ref('')
const estadoFiltro = ref('todos')

onMounted(async () => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
  if (sesion.rol !== 'supervisor') { router.push('/login'); return }
  await cargar()
})

const cargar = async () => {
  loading.value = true
  try {
    const res = await listarTodosCursos()
    if (res.success) cursos.value = res.data
  } catch (e) {
    console.error('Error al cargar cursos:', e)
  } finally {
    loading.value = false
  }
}

const conteos = computed(() =>
  cursos.value.reduce((acc, c) => { acc[c.estado] = (acc[c.estado] ?? 0) + 1; return acc }, {})
)

const cursosFiltrados = computed(() => {
  const porEstado = estadoFiltro.value !== 'todos'
    ? cursos.value.filter(c => c.estado === parseInt(estadoFiltro.value))
    : [...cursos.value]
  const q = busqueda.value.toLowerCase().trim()
  return q
    ? porEstado.filter(c => c.curso?.toLowerCase().includes(q) || c.nombre_publicador?.toLowerCase().includes(q))
    : porEstado
})

const limpiarFiltros = () => { busqueda.value = ''; estadoFiltro.value = 'todos' }

const mapearCurso = (c) => ({
  id: c.id_curso, titulo: c.curso, descripcion: c.descripcion, fecha: c.fecha_creacion,
  tipo: c.tipo_ofertante === 0 ? 'Estudiante' : 'Empleador', publicador: c.nombre_publicador || '—', estado: c.estado
})

const moderarCurso = async (id, estado, rechazo) => {
  procesando.value = id
  try { const res = await cambiarEstadoCurso(id, estado, rechazo); if (res.success) await cargar() }
  catch (e) { console.error('Error al moderar:', e) }
  finally { procesando.value = null }
}
</script>

<style scoped>
.gestion-cursos { padding: 24px; }
.gestion-cursos__estado { text-align: center; padding: 60px 0; color: #94a3b8; }
.gestion-cursos__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.btn-limpiar { margin-top: 12px; font-size: 14px; font-weight: 600; color: #1b2a4a; text-decoration: underline; background: none; border: none; cursor: pointer; }
</style>
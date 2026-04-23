<template>
  <div>
    <p class="text-gray-500 text-sm mb-6">
      Cursos que esperan tu aprobación para aparecer en el catálogo.
    </p>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      Cargando cursos pendientes...
    </div>

    <div v-else-if="pendientes.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">✅</p>
      <p class="font-medium">No hay cursos pendientes</p>
      <p class="text-sm mt-1">Todos los cursos han sido revisados</p>
    </div>

    <div v-else-if="cursosFiltrados.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">🔍</p>
      <p class="font-medium">No se encontraron cursos</p>
      <p class="text-sm mt-1">Prueba con otro término de búsqueda</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
import { ref, onMounted, computed } from 'vue'
import ModerarItemCard from './ModerarItemCard.vue'
import { listarCursosPendientes, cambiarEstadoCurso } from '../../services/supervisorService.js'

const pendientes = ref([])
const loading    = ref(true)
const procesando = ref(null)

const props = defineProps({
  filtro: { type: String, default: '' }
})

const cursosFiltrados = computed(() => {
  const search = props.filtro.toLowerCase().trim()
  if (!search) return pendientes.value
  
  return pendientes.value.filter(c => 
    c.curso?.toLowerCase().includes(search) || 
    c.nombre_publicador?.toLowerCase().includes(search)
  )
})

const mapearCurso = (curso) => ({
  id:          curso.id_curso,
  titulo:      curso.curso,
  descripcion: curso.descripcion,
  fecha:       curso.fecha_creacion,
  tipo:        curso.tipo_ofertante === 0 ? 'Estudiante' : 'Empleador',
  publicador:  curso.nombre_publicador || '—'
})

const cargar = async () => {
  loading.value = true
  try {
    const res = await listarCursosPendientes()
    if (res.success) pendientes.value = res.data
  } catch (e) {
    console.error('Error al cargar cursos pendientes:', e)
  } finally {
    loading.value = false
  }
}

const moderarCurso = async (id, estado, rechazo) => {
  procesando.value = id
  try {
    const res = await cambiarEstadoCurso(id, estado, rechazo)
    if (res.success) pendientes.value = pendientes.value.filter(c => c.id_curso !== id)
  } catch (e) {
    console.error('Error al moderar curso:', e)
  } finally {
    procesando.value = null
  }
}

onMounted(cargar)
</script>
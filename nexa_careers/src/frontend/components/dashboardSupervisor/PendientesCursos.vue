<template>
  <div>
    <p class="text-gray-500 text-sm mb-6">
      Gestiona todos los cursos publicados en la plataforma.
    </p>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      Cargando cursos...
    </div>

    <div v-else-if="cursos.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">📭</p>
      <p class="font-medium">No hay cursos registrados</p>
    </div>

    <div v-else-if="cursosFiltrados.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">🔍</p>
      <p class="font-medium">No se encontraron cursos</p>
      <p class="text-sm mt-1">Prueba con otros filtros de estado o búsqueda</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ModerarItemCard
        v-for="curso in cursosFiltrados"
        :key="curso.id_curso"
        :item="mapearCurso(curso)"
        :cargando="procesando === curso.id_curso"
        tipoContenido="curso"
        @accion="({ id, estado, rechazo }) => moderarCurso(id, estado, rechazo)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ModerarItemCard from './ModerarItemCard.vue'
import { listarTodosCursos, cambiarEstadoCurso } from '../../services/supervisorService.js'

const emit = defineEmits(['update:count'])

const cursos = ref([])
const loading = ref(true)
const procesando = ref(null)

const props = defineProps({
  filtro: { type: String, default: '' }
})

const estadosFiltro = ref({
  pendiente: true,
  aprobado: true,
  rechazado: true,
  archivado: true
})

//mapea todos los estados
const estadoAClave = {
  0: 'pendiente',
  1: 'aprobado',
  2: 'rechazado',
  3: 'archivado'
}

const cursosFiltrados = computed(() => {
  let resultado = [...cursos.value]
  resultado = resultado.filter(curso => {
    const clave = estadoAClave[curso.estado]
    if (!clave) return true
    return estadosFiltro.value[clave] === true
  })
  resultado.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
  const search = props.filtro.toLowerCase().trim()
  if (search) {
    resultado = resultado.filter(c =>
      c.curso?.toLowerCase().includes(search) ||
      c.nombre_publicador?.toLowerCase().includes(search)
    )
  }
  return resultado
})

const mapearCurso = (curso) => ({
  id:          curso.id_curso,
  titulo:      curso.curso,
  descripcion: curso.descripcion,
  fecha:       curso.fecha_creacion,
  tipo:        curso.tipo_ofertante === 0 ? 'Estudiante' : 'Empleador',
  publicador:  curso.nombre_publicador || '—',
  estado:      curso.estado
})

const cargar = async () => {
  loading.value = true
  try {
    const res = await listarTodosCursos()
    if (res.success) {
      cursos.value = res.data
      emit('update:count', res.data.filter(c => c.estado === 0).length)
    }
  } catch (e) {
    console.error('Error al cargar cursos:', e)
  } finally {
    loading.value = false
  }
}

const moderarCurso = async (id, estado, rechazo) => {
  procesando.value = id
  try {
    const res = await cambiarEstadoCurso(id, estado, rechazo)
    if (res.success) {
      await cargar()
    }
  } catch (e) {
    console.error('Error al moderar curso:', e)
  } finally {
    procesando.value = null
  }
}

onMounted(cargar)
</script>
<template>
  <div>
    <p class="text-gray-500 text-sm mb-6">
      Gestiona todos los cursos publicados en la plataforma.
    </p>

    <div class="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">Filtrar por estado:</h4>
      <div class="flex flex-wrap gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="estadosFiltro.pendiente" 
            class="w-4 h-4 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
          />
          <span class="text-sm text-gray-700">
            <span class="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
            Pendiente
          </span>
          <span class="text-xs text-gray-400">({{ contarPorEstado(0) }})</span>
        </label>
        
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="estadosFiltro.aprobado" 
            class="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
          />
          <span class="text-sm text-gray-700">
            <span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Aprobado
          </span>
          <span class="text-xs text-gray-400">({{ contarPorEstado(1) }})</span>
        </label>
        
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="estadosFiltro.rechazado" 
            class="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
          />
          <span class="text-sm text-gray-700">
            <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
            Rechazado
          </span>
          <span class="text-xs text-gray-400">({{ contarPorEstado(2) }})</span>
        </label>
        
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="estadosFiltro.archivado" 
            class="w-4 h-4 text-gray-600 rounded border-gray-300 focus:ring-gray-500"
          />
          <span class="text-sm text-gray-700">
            <span class="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
            Archivado
          </span>
          <span class="text-xs text-gray-400">({{ contarPorEstado(3) }})</span>
        </label>
      </div>
      
      <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button 
          @click="seleccionarTodos" 
          class="text-xs text-blue-600 hover:text-blue-800"
        >
          Seleccionar todos
        </button>
        <span class="text-gray-300">|</span>
        <button 
          @click="limpiarFiltros" 
          class="text-xs text-red-600 hover:text-red-800"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

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
        @accion="({ id, estado, rechazo }) => moderarCurso(id, estado, rechazo)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ModerarItemCard from './ModerarItemCard.vue'
import { listarTodosCursos, cambiarEstadoCurso } from '../../services/supervisorService.js'

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

const estadoAClave = {
  0: 'pendiente',
  1: 'aprobado',
  2: 'rechazado',
  3: 'archivado'
}

const contarPorEstado = (estado) => {
  return cursos.value.filter(c => c.estado === estado).length
}

const cursosFiltrados = computed(() => {
  let resultado = [...cursos.value]
  
  resultado = resultado.filter(curso => {
    const clave = estadoAClave[curso.estado]
    return estadosFiltro.value[clave] === true
  })
  
  const search = props.filtro.toLowerCase().trim()
  if (search) {
    resultado = resultado.filter(c => 
      c.curso?.toLowerCase().includes(search) || 
      c.nombre_publicador?.toLowerCase().includes(search)
    )
  }
  
  return resultado
})


const seleccionarTodos = () => {
  estadosFiltro.value = {
    pendiente: true,
    aprobado: true,
    rechazado: true,
    archivado: true
  }
}

const limpiarFiltros = () => {
  estadosFiltro.value = {
    pendiente: false,
    aprobado: false,
    rechazado: false,
    archivado: false
  }
}

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
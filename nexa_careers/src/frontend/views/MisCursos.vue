<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <MisCursosHeader />

      <MisCursosFiltros
        v-model:busqueda="busqueda"
        v-model:categoriaFiltro="categoriaFiltro"
        v-model:estadoFiltro="estadoFiltro"
        v-model:fechaFiltro="fechaFiltro"
        :categorias="categorias"
        @update:busqueda="aplicarFiltros"
        @update:categoriaFiltro="aplicarFiltros"
        @update:estadoFiltro="aplicarFiltros"
        @update:fechaFiltro="aplicarFiltros"
      />

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando tus cursos...
      </div>

      <CursosVacio v-else-if="cursosFiltrados.length === 0" />

      <CursoGrid v-else :cursos="cursosFiltrados" />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  listarCursosPublicadosPorEstudiante, 
  listarCursosPublicadosPorEmpleador,
  listarCategorias
} from '../services/cursoService.js'
import MisCursosHeader from '../components/misCursos/MisCursosHeader.vue'
import MisCursosFiltros from '../components/misCursos/MisCursosFiltros.vue'
import CursoGrid from '../components/misCursos/CursoGrid.vue'
import CursosVacio from '../components/misCursos/CursosVacio.vue'

const router = useRouter()
const cursosOriginal = ref([]) 
const cursosFiltrados = ref([])  
const loading = ref(true)
const categorias = ref([])

const busqueda = ref('')
const categoriaFiltro = ref(null)
const estadoFiltro = ref(null)   
const fechaFiltro = ref({ preset: '', desde: '', hasta: '' })

const aplicarFiltros = () => {
  let resultado = [...cursosOriginal.value]

  if (busqueda.value.trim()) {
    const term = busqueda.value.toLowerCase()
    resultado = resultado.filter(c => c.curso.toLowerCase().includes(term))
  }

  if (categoriaFiltro.value) {
    resultado = resultado.filter(c =>
      c.categorias && c.categorias.some(cat => cat.id_categoria === categoriaFiltro.value)
    )
  }

  if (estadoFiltro.value !== null && estadoFiltro.value !== undefined) {
    resultado = resultado.filter(c => c.estado === estadoFiltro.value)
  }

  if (fechaFiltro.value.desde || fechaFiltro.value.hasta) {
    resultado = resultado.filter(curso => {
      const fechaCurso = new Date(curso.fecha_creacion)
      const desde = fechaFiltro.value.desde ? new Date(fechaFiltro.value.desde) : null
      const hasta = fechaFiltro.value.hasta ? new Date(fechaFiltro.value.hasta) : null
      if (desde && hasta) return fechaCurso >= desde && fechaCurso <= hasta
      if (desde) return fechaCurso >= desde
      if (hasta) return fechaCurso <= hasta
      return true
    })
  }

  cursosFiltrados.value = resultado
}

onMounted(async () => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')

  if (!sesion.rol || !sesion.id) {
    router.push('/login')
    return
  }

  try {
    const catRes = await listarCategorias()
    if (catRes.success) {
      categorias.value = catRes.data
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }

  try {
    let response
    if (sesion.rol === 'estudiante') {
      response = await listarCursosPublicadosPorEstudiante(sesion.id)
    } else if (sesion.rol === 'empleador') {
      response = await listarCursosPublicadosPorEmpleador(sesion.id)
    } else {
      router.push('/home')
      return
    }

    if (response.success) {
      cursosOriginal.value = response.data
      aplicarFiltros() 
    }
  } catch (error) {
    console.error('Error al cargar cursos:', error)
  } finally {
    loading.value = false
  }
})
</script>
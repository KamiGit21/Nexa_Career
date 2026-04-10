<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <CatalogoCursosHeader />

      <CatalogoCursosFiltros
        v-model:busqueda="busqueda"
        v-model:categoriaActiva="categoriaActiva"
        v-model:orden="orden"
        :categorias="CATEGORIAS"
      />

      <!-- Contador de resultados -->
      <div v-if="!loading && cursosTotalesFiltrados.length > 0" class="mb-5 text-sm text-gray-500">
        Mostrando <span class="font-semibold text-[#1b2a4a]">{{ rangoInicio }}–{{ rangoFin }}</span>
        de <span class="font-semibold text-[#1b2a4a]">{{ cursosTotalesFiltrados.length }}</span>
        {{ cursosTotalesFiltrados.length === 1 ? 'curso' : 'cursos' }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando cursos...
      </div>

      <div v-else-if="cursosTotalesFiltrados.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-5xl mb-4">🔍</p>
        <p class="text-lg font-medium">No se encontraron cursos</p>
        <p class="text-sm mt-1">Intenta con otro nombre o categoría</p>
      </div>

      <CursoPublicoGrid
        v-else
        :cursos="cursosPaginaActual"
        @ver="irDetalle"
      />

      <CatalogoCursosPaginacion
        :pagina-actual="paginaActual"
        :total-paginas="totalPaginas"
        @cambiar="cambiarPagina"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarCursosPublicos } from '../services/cursoService.js'
import CatalogoCursosHeader      from '../components/catalogoCursos/CatalogoCursosHeader.vue'
import CatalogoCursosFiltros     from '../components/catalogoCursos/CatalogoCursosFiltros.vue'
import CursoPublicoGrid          from '../components/catalogoCursos/CursoPublicoGrid.vue'
import CatalogoCursosPaginacion  from '../components/catalogoCursos/CatalogoCursosPaginacion.vue'

const router  = useRouter()
const cursos  = ref([])
const loading = ref(true)

const busqueda        = ref('')
const categoriaActiva = ref('Todos')
const orden           = ref('reciente')
const CATEGORIAS = ['Todos', 'Tecnología', 'Finanzas', 'Diseño', 'Marketing', 'Redes']

const ITEMS_POR_PAGINA = 15
const paginaActual     = ref(1)

watch([busqueda, categoriaActiva, orden], () => {
  paginaActual.value = 1
})

// Datos filtrados (resultados sin paginar) 
const cursosTotalesFiltrados = computed(() => {
  let lista = cursos.value.filter(c => {
    const cumpleCategoria =
      categoriaActiva.value === 'Todos' ||
      c.categoria?.toLowerCase() === categoriaActiva.value.toLowerCase()

    const q = busqueda.value.toLowerCase().trim()
    const cumpleBusqueda =
      !q ||
      c.curso?.toLowerCase().includes(q) ||
      c.categoria?.toLowerCase().includes(q)

    return cumpleCategoria && cumpleBusqueda
  })

  return lista.sort((a, b) => {
    if (orden.value === 'reciente') {
      return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0)
    } else if (orden.value === 'antiguo') {
      return new Date(a.fecha_creacion || 0) - new Date(b.fecha_creacion || 0)
    } else if (orden.value === 'titulo') {
      return (a.curso || '').localeCompare(b.curso || '')
    }
    return 0
  })
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(cursosTotalesFiltrados.value.length / ITEMS_POR_PAGINA))
)

const cursosPaginaActual = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  return cursosTotalesFiltrados.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})

const rangoInicio = computed(() => (paginaActual.value - 1) * ITEMS_POR_PAGINA + 1)
const rangoFin    = computed(() =>
  Math.min(paginaActual.value * ITEMS_POR_PAGINA, cursosTotalesFiltrados.value.length)
)

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
  paginaActual.value = nuevaPagina
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const irDetalle = (id) => router.push(`/cursos/${id}`)

onMounted(async () => {
  try {
    const response = await listarCursosPublicos()
    if (response.success) {
      cursos.value = response.data || []
    }
  } catch (error) {
    console.error('Error al cargar catálogo:', error)
  } finally {
    loading.value = false
  }
})
</script>
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

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando cursos...
      </div>

      <!-- Vacío -->
      <div v-else-if="cursosFiltrados.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-5xl mb-4">🔍</p>
        <p class="text-lg font-medium">No se encontraron cursos</p>
        <p class="text-sm mt-1">Intenta con otro nombre o categoría</p>
      </div>

      <!-- Grid -->
      <CursoPublicoGrid
        v-else
        :cursos="cursosFiltrados"
        @ver="irDetalle"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarCursosPublicos } from '../services/cursoService.js'
import CatalogoCursosHeader  from '../components/catalogoCursos/CatalogoCursosHeader.vue'
import CatalogoCursosFiltros from '../components/catalogoCursos/CatalogoCursosFiltros.vue'
import CursoPublicoGrid      from '../components/catalogoCursos/CursoPublicoGrid.vue'

const router  = useRouter()
const cursos  = ref([])
const loading = ref(true)

const busqueda        = ref('')
const categoriaActiva = ref('Todos')
const orden           = ref('reciente')

const CATEGORIAS = ['Todos', 'Tecnología', 'Finanzas', 'Diseño', 'Marketing', 'Redes']

const cursosFiltrados = computed(() => {
  let lista = [...cursos.value]

  if (categoriaActiva.value !== 'Todos') {
    lista = lista.filter(c =>
      c.categoria?.toLowerCase() === categoriaActiva.value.toLowerCase()
    )
  }

  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(c =>
      c.curso?.toLowerCase().includes(q) ||
      c.categoria?.toLowerCase().includes(q)
    )
  }

  if (orden.value === 'reciente') {
    lista.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
  } else if (orden.value === 'antiguo') {
    lista.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion))
  } else if (orden.value === 'titulo') {
    lista.sort((a, b) => a.curso?.localeCompare(b.curso))
  }

  return lista
})

const irDetalle = (id) => router.push(`/cursos/${id}`)

onMounted(async () => {
  try {
    const response = await listarCursosPublicos()
    if (response.success) cursos.value = response.data
  } catch (error) {
    console.error('Error al cargar catálogo:', error)
  } finally {
    loading.value = false
  }
})
</script>
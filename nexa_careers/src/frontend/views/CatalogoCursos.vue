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

// Sugerencia: Mover esto a un archivo de constantes si se usa en PublicarCurso.vue
const CATEGORIAS = ['Todos', 'Tecnología', 'Finanzas', 'Diseño', 'Marketing', 'Redes']

const cursosFiltrados = computed(() => {
  // 1. Filtramos primero (es más eficiente filtrar y luego ordenar una lista pequeña)
  let lista = cursos.value.filter(c => {
    const cumpleCategoria = categoriaActiva.value === 'Todos' || 
                            c.categoria?.toLowerCase() === categoriaActiva.value.toLowerCase();
    
    const q = busqueda.value.toLowerCase().trim();
    const cumpleBusqueda = !q || 
                           c.curso?.toLowerCase().includes(q) || 
                           c.categoria?.toLowerCase().includes(q);
    
    return cumpleCategoria && cumpleBusqueda;
  });

  // 2. Ordenamos la lista resultante
  return lista.sort((a, b) => {
    if (orden.value === 'reciente') {
      return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
    } else if (orden.value === 'antiguo') {
      return new Date(a.fecha_creacion || 0) - new Date(b.fecha_creacion || 0);
    } else if (orden.value === 'titulo') {
      return (a.curso || '').localeCompare(b.curso || '');
    }
    return 0;
  });
})

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
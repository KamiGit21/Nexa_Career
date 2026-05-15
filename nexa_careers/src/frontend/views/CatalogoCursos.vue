<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] overflow-hidden">

    <CatalogoCursosHeader v-model:busqueda="busqueda" :orden="orden" @buscar="aplicarFiltrosLocales"
      @toggle-orden="toggleOrden" />

    <CatalogoCursosFiltros v-model:categoriaActiva="categoriaActiva" v-model:orden="orden" :categorias="categoriasDisponibles" />

    <main class="max-w-7xl mx-auto pt-12 pb-4 px-6">

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando cursos...
      </div>

      <template v-else>
        <div v-if="cursosFiltradosLocales.length === 0" class="text-center py-20 text-gray-400">
          <p class="text-5xl mb-4">🔍</p>
          <p class="text-lg font-medium">No encontramos resultados para tu búsqueda</p>
          <button @click="restablecerFiltros" class="mt-4 text-[#1b2a4a] font-bold hover:underline">
            Limpiar todos los filtros
          </button>
        </div>

        <template v-else>
          <div class="flex justify-end items-center mb-6 gap-3">
            <label for="pageSize" class="text-[#002855] font-semibold text-sm">
              Cursos por página:
            </label>
            <select id="pageSize" v-model="itemsPorPagina"
              class="border-2 border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#b5943a] transition-colors cursor-pointer">
              <option v-for="n in opcionesPagina" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>

          <CursoPublicoGrid :cursos="cursosPaginados" @ver="irDetalle" />

          <CatalogoCursosPaginacion id="punto-final" v-if="totalPaginasComp > 1" :pagina-actual="paginaActual"
            :total-paginas="totalPaginasComp" @cambiar="cambiarPagina" />
        </template>
      </template>
    </main>
    <div class="min-h-screen bg-[#f8f5f0]">
      <BotonScroll />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { listarCursosPublicosPaginados } from '../services/cursoService.js'

// Componentes
import CatalogoCursosHeader from '../components/catalogoCursos/CatalogoCursosHeader.vue'
import CatalogoCursosFiltros from '../components/catalogoCursos/CatalogoCursosFiltros.vue'
import CursoPublicoGrid from '../components/catalogoCursos/CursoPublicoGrid.vue'
import CatalogoCursosPaginacion from '../components/catalogoCursos/CatalogoCursosPaginacion.vue'
import BotonScroll from '../components/comunes/BotonScroll.vue'

const router = useRouter()
const cursosOriginales = ref([])
const loading = ref(true)

// Filtros y Paginación
const busqueda = ref('')
const categoriaActiva = ref('Todas')
const orden = ref('reciente')

// CATEGORÍAS (mock mientras backend está en mantenimiento)
const categoriasDisponibles = ref([
  'Todas',
  'Desarrollo Web',
  'Data Science',
  'Diseño UX/UI',
  'Marketing Digital',
  'Negocios',
  'Idiomas',
  'Fotografía',
  'Música'
])

const itemsPorPagina = ref(15)
const opcionesPagina = [9, 12, 15, 18, 21, 24, 27, 30]
const paginaActual = ref(1)

// Cursos después de aplicar filtros locales
const cursosFiltradosLocales = ref([])

// Cursos paginados para mostrar
const cursosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return cursosFiltradosLocales.value.slice(inicio, fin)
})

// Calcular total de páginas
const totalPaginasComp = computed(() => {
  return Math.ceil(cursosFiltradosLocales.value.length / itemsPorPagina.value)
})

const toggleOrden = () => {
  orden.value = orden.value === 'reciente' ? 'antiguo' : 'reciente'
  aplicarOrdenYFiltros()
}

// Aplicar orden a los cursos
const aplicarOrden = (cursos) => {
  const cursosCopy = [...cursos]
  if (orden.value === 'reciente') {
    return cursosCopy.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
  } else if (orden.value === 'antiguo') {
    return cursosCopy.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion))
  } else if (orden.value === 'titulo') {
    return cursosCopy.sort((a, b) => (a.curso || '').localeCompare(b.curso || ''))
  }
  return cursosCopy
}

// Función principal de filtrado local
const aplicarFiltrosLocales = () => {
  let filtrados = [...cursosOriginales.value]

  // Filtrar por búsqueda (título o descripción)
  if (busqueda.value.trim()) {
    const busquedaLower = busqueda.value.toLowerCase()
    filtrados = filtrados.filter(curso => 
      (curso.curso && curso.curso.toLowerCase().includes(busquedaLower)) ||
      (curso.descripcion && curso.descripcion.toLowerCase().includes(busquedaLower))
    )
  }

  // Filtrar por categoría (simulado mientras backend no tiene categorías en cursos)
  if (categoriaActiva.value !== 'Todas') {
    filtrados = filtrados.filter(curso => {
      // Simulación: asignar categoría basada en ID del curso
      const categoriasList = categoriasDisponibles.value.slice(1) // Quitar 'Todas'
      const indexCurso = (curso.id_curso || 0) % categoriasList.length
      const categoriaCurso = categoriasList[indexCurso]
      return categoriaCurso === categoriaActiva.value
    })
  }

  // Aplicar orden
  filtrados = aplicarOrden(filtrados)
  
  cursosFiltradosLocales.value = filtrados
  paginaActual.value = 1 // Resetear a primera página
}

const aplicarOrdenYFiltros = () => {
  const filtrados = [...cursosFiltradosLocales.value]
  cursosFiltradosLocales.value = aplicarOrden(filtrados)
  paginaActual.value = 1
}

// Cargar cursos desde el servicio
const cargarCursos = async () => {
  loading.value = true
  try {
    const response = await listarCursosPublicosPaginados(1, 100)
    if (response.success && response.data) {
      cursosOriginales.value = response.data
      
      // Agregar fechas de creación si no existen
      cursosOriginales.value = cursosOriginales.value.map((curso, idx) => ({
        ...curso,
        fecha_creacion: curso.fecha_creacion || new Date(Date.now() - idx * 86400000).toISOString().split('T')[0]
      }))
      
      aplicarFiltrosLocales()
    } else {
      // Datos mock para demostración (mientras backend está en mantenimiento)
      usarDatosMock()
    }
  } catch (error) {
    console.error('Error cargando cursos, usando datos mock:', error)
    usarDatosMock()
  } finally {
    loading.value = false
  }
}

// Datos mock para demostración
const usarDatosMock = () => {
  cursosOriginales.value = [
    {
      id_curso: 1,
      curso: 'Desarrollo Web Full Stack',
      descripcion: 'Aprende HTML, CSS, JavaScript, React y Node.js',
      fecha_creacion: '2025-03-15',
      contacto: 'contacto@ejemplo.com',
      estado: 1
    },
    {
      id_curso: 2,
      curso: 'Data Science con Python',
      descripcion: 'Pandas, NumPy, Matplotlib y Machine Learning básico',
      fecha_creacion: '2025-03-10',
      contacto: 'datascience@ejemplo.com',
      estado: 1
    },
    {
      id_curso: 3,
      curso: 'Diseño UX/UI Profesional',
      descripcion: 'Figma, investigación de usuarios, prototipado',
      fecha_creacion: '2025-03-05',
      contacto: 'ux@ejemplo.com',
      estado: 1
    },
    {
      id_curso: 4,
      curso: 'Marketing Digital Avanzado',
      descripcion: 'SEO, SEM, redes sociales, email marketing',
      fecha_creacion: '2025-02-28',
      contacto: 'marketing@ejemplo.com',
      estado: 1
    },
    {
      id_curso: 5,
      curso: 'Inglés para Negocios',
      descripcion: 'Mejora tu inglés técnico y profesional',
      fecha_creacion: '2025-02-20',
      contacto: 'idiomas@ejemplo.com',
      estado: 1
    },
    {
      id_curso: 6,
      curso: 'Fotografía Profesional',
      descripcion: 'Composición, iluminación, edición con Lightroom',
      fecha_creacion: '2025-03-01',
      contacto: 'foto@ejemplo.com',
      estado: 1
    }
  ]
  aplicarFiltrosLocales()
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginasComp.value) return
  paginaActual.value = nuevaPagina
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const restablecerFiltros = () => {
  busqueda.value = ''
  categoriaActiva.value = 'Todas'
  orden.value = 'reciente'
  aplicarFiltrosLocales()
}

const irDetalle = (id) => router.push(`/cursos/${id}`)

//para aplicar filtros 
watch([busqueda, categoriaActiva], () => {
  aplicarFiltrosLocales()
})

watch(orden, () => {
  aplicarOrdenYFiltros()
})

watch(itemsPorPagina, () => {
  paginaActual.value = 1
})

onMounted(() => cargarCursos())
</script>
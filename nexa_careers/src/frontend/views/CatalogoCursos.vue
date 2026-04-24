<template>
  <div class="min-h-screen bg-[#f8f5f0]">

      <CatalogoCursosHeader 
        v-model:busqueda="busqueda"
        :orden="orden"
        @buscar="cargarCursos(1)"
        @toggle-orden="toggleOrden"
      />

      <CatalogoCursosFiltros
        v-model:categoriaActiva="categoriaActiva"
        v-model:orden="orden"
        :categorias="CATEGORIAS"
      />

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando cursos...
      </div>

      <template v-else>
        <div v-if="cursosAMostrar.length === 0" class="text-center py-20 text-gray-400">
          <p class="text-5xl mb-4">🔍</p>
          <p class="text-lg font-medium">No encontramos resultados para tu búsqueda</p>
          <button @click="restablecerFiltros" class="mt-4 text-[#1b2a4a] font-bold hover:underline">
            Limpiar todos los filtros
          </button>
        </div>

        <template v-else>
          <CursoPublicoGrid
            :cursos="cursosAMostrar"
            @ver="irDetalle"
          />

          <CatalogoCursosPaginacion
            v-if="totalPaginas > 1"
            :pagina-actual="paginaActual"
            :total-paginas="totalPaginas"
            @cambiar="cambiarPagina"
          />
        </template>
      </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  listarCursosPublicosPaginados, 
  listarCursosPublicosPaginadosPorFecha 
} from '../services/cursoService.js'

// Componentes
import CatalogoCursosHeader from '../components/catalogoCursos/CatalogoCursosHeader.vue'
import CatalogoCursosFiltros from '../components/catalogoCursos/CatalogoCursosFiltros.vue'
import CursoPublicoGrid from '../components/catalogoCursos/CursoPublicoGrid.vue'
import CatalogoCursosPaginacion from '../components/catalogoCursos/CatalogoCursosPaginacion.vue'

const router = useRouter()
const cursos = ref([]) 
const loading = ref(true)

// Filtros y Paginación
const busqueda = ref('')
const categoriaActiva = ref('Todos')
const orden = ref('reciente') // 'reciente' o 'antiguo'
const CATEGORIAS = ['Todos', 'Tecnología', 'Finanzas', 'Diseño', 'Marketing', 'Redes']

const ITEMS_POR_PAGINA = 15
const paginaActual = ref(1)
const totalPaginas = ref(1)


const toggleOrden = () => {
  orden.value = orden.value === 'reciente' ? 'antiguo' : 'reciente';
  cargarCursos(1);
}

const cargarCursos = async (pagina = 1) => {
  loading.value = true
  paginaActual.value = pagina
  
  try {
    let response;
    if (orden.value === 'reciente') {
      response = await listarCursosPublicosPaginadosPorFecha(pagina, ITEMS_POR_PAGINA, 'abajo');
    } else if (orden.value === 'antiguo') {
      response = await listarCursosPublicosPaginadosPorFecha(pagina, ITEMS_POR_PAGINA, 'arriba');
    } else {
      response = await listarCursosPublicosPaginados(pagina, ITEMS_POR_PAGINA);
    }

    if (response.success) {
      cursos.value = response.data;
      totalPaginas.value = response.paginas;
    } else {
      cursos.value = [];
      totalPaginas.value = 1;
    }
  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    cursos.value = [];
  } finally {
    loading.value = false
  }
}

const cursosAMostrar = computed(() => {
  let lista = cursos.value;

  if (categoriaActiva.value !== 'Todos') {
    lista = lista.filter(c => c.categoria?.toLowerCase() === categoriaActiva.value.toLowerCase());
  }

  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase().trim();
    lista = lista.filter(c => 
      c.curso?.toLowerCase().includes(q) //|| 
      //c.descripcion?.toLowerCase().includes(q)
    );
  }
  return lista;
});


watch(orden, () => {
  cargarCursos(1);
});

// Resetear página si el usuario filtra
watch([busqueda, categoriaActiva], () => {
  paginaActual.value = 1;
});

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
  cargarCursos(nuevaPagina)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const restablecerFiltros = () => {
  busqueda.value = '';
  categoriaActiva.value = 'Todos';
  orden.value = 'reciente';
  cargarCursos(1);
}

const irDetalle = (id) => router.push(`/cursos/${id}`)

onMounted(() => cargarCursos(1))
</script>
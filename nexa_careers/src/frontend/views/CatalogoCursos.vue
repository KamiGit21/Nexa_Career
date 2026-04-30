<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] overflow-hidden">

    <CatalogoCursosHeader v-model:busqueda="busqueda" :orden="orden" @buscar="cargarCursos(1)"
      @toggle-orden="toggleOrden" />

    <CatalogoCursosFiltros v-model:categoriaActiva="categoriaActiva" v-model:orden="orden" :categorias="CATEGORIAS" />

    <main class="max-w-7xl mx-auto pt-12 pb-4 px-6">

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

          <CursoPublicoGrid :cursos="cursosAMostrar" @ver="irDetalle" />

          <CatalogoCursosPaginacion id="punto-final" v-if="totalPaginas > 1" :pagina-actual="paginaActual"
            :total-paginas="totalPaginas" @cambiar="cambiarPagina" />
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
import {
  listarCursosPublicosPaginados,
  listarCursosPublicosPaginadosPorFecha,
  buscarCursosAvanzado
} from '../services/cursoService.js'

// Componentes
import CatalogoCursosHeader from '../components/catalogoCursos/CatalogoCursosHeader.vue'
import CatalogoCursosFiltros from '../components/catalogoCursos/CatalogoCursosFiltros.vue'
import CursoPublicoGrid from '../components/catalogoCursos/CursoPublicoGrid.vue'
import CatalogoCursosPaginacion from '../components/catalogoCursos/CatalogoCursosPaginacion.vue'

// importar componente de botonscroll
import BotonScroll from '../components/comunes/BotonScroll.vue'

import { obtenerEstudiantePorId } from '@/services/estudianteService.js'
import { obtenerEmpleadorPorId } from '@/services/empleadorService.js'


const router = useRouter()
const cursos = ref([])
const loading = ref(true)

// Filtros y Paginación
const busqueda = ref('')
const categoriaActiva = ref('Todos')
const orden = ref('reciente')
const CATEGORIAS = ['Todos', 'Tecnología', 'Finanzas', 'Diseño', 'Marketing', 'Redes']

const itemsPorPagina = ref(15)
const opcionesPagina = [9, 12, 15, 18, 21, 24, 27, 30]

const paginaActual = ref(1)
const totalPaginas = ref(1)


const toggleOrden = () => {
  orden.value = orden.value === 'reciente' ? 'antiguo' : 'reciente';
  cargarCursos(1);
}

const cargarCursos = async (pagina = 1) => {
  loading.value = true;
  paginaActual.value = pagina;

  try {
    const response = await buscarCursosAvanzado({
      pagina: paginaActual.value,
      size: itemsPorPagina.value,
      q: busqueda.value,
      categoria: categoriaActiva.value,
      orden: orden.value
    });

    if (response.success) {
      cursos.value = response.data;
      totalPaginas.value = response.paginas || 1;
    } else {
      cursos.value = [];
      totalPaginas.value = 1;
    }
  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    cursos.value = [];
  } finally {
    loading.value = false;
  }
};

const cursosAMostrar = computed(() => {
  return cursos.value;
});

watch([orden, itemsPorPagina], () => {
  cargarCursos(1);
});

watch([busqueda, categoriaActiva, orden, itemsPorPagina], () => {
  cargarCursos(1);
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
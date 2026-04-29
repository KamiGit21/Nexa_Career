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
          <select 
            id="pageSize" 
            v-model="itemsPorPagina"
            class="border-2 border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#b5943a] transition-colors cursor-pointer"
          >
            <option v-for="n in opcionesPagina" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>

        <CursoPublicoGrid :cursos="cursosAMostrar" @ver="irDetalle" />

        <CatalogoCursosPaginacion id="punto-final" v-if="totalPaginas > 1" :pagina-actual="paginaActual" :total-paginas="totalPaginas"
          @cambiar="cambiarPagina" />
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
  listarCursosPublicosPaginadosPorFecha
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
const orden = ref('reciente') // 'reciente' o 'antiguo'
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
  loading.value = true
  paginaActual.value = pagina

  try {
    let response;
    if (orden.value === 'reciente') {
      response = await listarCursosPublicosPaginadosPorFecha(pagina, itemsPorPagina.value, 'abajo');
    } else if (orden.value === 'antiguo') {
      response = await listarCursosPublicosPaginadosPorFecha(pagina, itemsPorPagina.value, 'arriba');
    } else {
      response = await listarCursosPublicosPaginados(pagina, itemsPorPagina.value);
    }

   if (response && response.success && response.data) {
      const cursosEnriquecidos = await Promise.all(
        response.data.map(async (curso) => {
          let nombrePublicador = 'Usuario Desconocido';
          if (curso.tipo_ofertante === 0 || curso.id_estudiante) {
             const id = curso.id_estudiante || curso.id_ofertante;
             if (id) {
               try {
                 const estRes = await obtenerEstudiantePorId(id);
                 if (estRes.success && estRes.data) {
                   nombrePublicador = `${estRes.data.nombre} ${estRes.data.apellido}`;
                 }
               } catch (e) { console.error('Error buscando estudiante:', e) }
             }
          } else if (curso.tipo_ofertante === 1 || curso.id_empleador) {
             const id = curso.id_empleador || curso.id_ofertante;
             if (id) {
               try {
                 const empRes = await obtenerEmpleadorPorId(id);
                 if (empRes.success && empRes.data) {
                   nombrePublicador = empRes.data.empresa || empRes.data.nombre || 'Empresa';
                 }
               } catch (e) { console.error('Error buscando empleador:', e) }
             }
          }
          return { ...curso, nombre_publicador: nombrePublicador };
        })
      );

      cursos.value = cursosEnriquecidos;
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


watch([orden, itemsPorPagina], () => {
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
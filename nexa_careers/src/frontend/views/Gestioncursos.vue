<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] overflow-hidden min-h-screen">

    <div class="bg-[#1b2a4a] py-8 px-6 text-center shadow-md">
      <h1 class="text-3xl font-bold text-[#D1B16D] mb-2">Gestión de Cursos</h1>
      <p class="text-gray-300">Administra, filtra y revisa todos los cursos de la plataforma.</p>
    </div>

    <main class="max-w-7xl mx-auto pt-8 pb-4 px-6">

      <div class="flex flex-wrap justify-between items-center bg-white p-5 rounded-2xl shadow-sm mb-8 gap-4 border border-gray-100">
        
        <div class="flex items-center gap-3">
          <label class="text-[#002855] font-semibold text-sm">Estado:</label>
          <select 
            v-model="estadoFiltro" 
            class="border-2 border-gray-300 rounded-lg px-3 py-1.5 focus:border-[#b5943a] outline-none cursor-pointer text-sm bg-gray-50 hover:bg-white transition-colors"
          >
            <option value="Todos">Todos</option>
            <option value="0">Pendiente</option>
            <option value="1">Aprobado</option>
            <option value="2">Rechazado</option>
            <option value="3">Archivado</option>
          </select>
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <button 
            @click="toggleOrden" 
            class="text-sm font-semibold text-[#002855] border-2 border-[#002855] px-4 py-1.5 rounded-lg hover:bg-[#002855] hover:text-white transition-colors"
          >
            Orden: {{ orden === 'reciente' ? 'Más Recientes' : 'Más Antiguos' }}
          </button>

          <div class="flex items-center gap-3">
            <label class="text-[#002855] font-semibold text-sm">Mostrar:</label>
            <select 
              v-model="itemsPorPagina" 
              class="border-2 border-gray-300 rounded-lg px-3 py-1.5 focus:border-[#b5943a] outline-none cursor-pointer text-sm bg-gray-50 hover:bg-white transition-colors"
            >
              <option v-for="n in opcionesPagina" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b2a4a] mx-auto mb-4"></div>
        Cargando inventario de cursos...
      </div>

      <template v-else>
        <div v-if="cursos.length === 0" class="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-5xl mb-4">📂</p>
          <p class="text-lg font-medium">No hay cursos que coincidan con este filtro.</p>
          <button @click="restablecerFiltros" class="mt-4 text-[#b5943a] font-bold hover:underline">
            Restablecer todos los filtros
          </button>
        </div>

        <template v-else>
          <p class="text-sm text-gray-500 mb-6 font-medium">
            Página <span class="text-[#1b2a4a]">{{ paginaActual }}</span> de <span class="text-[#1b2a4a]">{{ totalPaginas }}</span>
          </p>

          <CursoPublicoGrid
            :cursos="cursos"
            @ver="irDetalle"
          />

          <CatalogoCursosPaginacion
            id="punto-final"
            v-if="totalPaginas > 1"
            :pagina-actual="paginaActual"
            :total-paginas="totalPaginas"
            @cambiar="cambiarPagina"
          />
        </template>
      </template>

    </main>
    
    <BotonScroll />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  listarCursosPaginadosPorFecha,
  listarCursosPublicosPaginadosPorFechaPorEstado 
} from '../services/cursoService.js'

import CursoPublicoGrid from '@/components/catalogoCursos/CursoPublicoGrid.vue'
import CatalogoCursosPaginacion from '@/components/catalogoCursos/CatalogoCursosPaginacion.vue'
import BotonScroll from '@/components/comunes/BotonScroll.vue'
import { obtenerEstudiantePorId } from '@/services/estudianteService.js'
import { obtenerEmpleadorPorId } from '@/services/empleadorService.js'

const router = useRouter()
const cursos = ref([]) 
const loading = ref(true)


const estadoFiltro = ref('Todos') 
const orden = ref('reciente') 
const itemsPorPagina = ref(15) 
const opcionesPagina = [9, 12, 15, 18, 21, 24, 27, 30]

const paginaActual = ref(1)
const totalPaginas = ref(1)

const toggleOrden = () => {
  orden.value = orden.value === 'reciente' ? 'antiguo' : 'reciente';
}

const cargarCursos = async (pagina = 1) => {
  loading.value = true
  paginaActual.value = pagina
  
  try {
    let response;
    const direccion = orden.value === 'reciente' ? 'abajo' : 'arriba';

    // Determinar qué endpoint llamar basado en el filtro de estado
    if (estadoFiltro.value === 'Todos') {
      response = await listarCursosPaginadosPorFecha(pagina, itemsPorPagina.value, direccion);
    } else {
      // Usamos el servicio que filtra por estado y fecha
      response = await listarCursosPublicosPaginadosPorFechaPorEstado(pagina, itemsPorPagina.value, direccion, estadoFiltro.value);
    }

    if (response && response.success && response.data) {
      // MAGIA: Enriquecer los cursos con el nombre del publicador
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
               } catch (e) {}
             }
          } else if (curso.tipo_ofertante === 1 || curso.id_empleador) {
             const id = curso.id_empleador || curso.id_ofertante;
             if (id) {
               try {
                 const empRes = await obtenerEmpleadorPorId(id);
                 if (empRes.success && empRes.data) {
                   nombrePublicador = empRes.data.empresa || empRes.data.nombre || 'Empresa';
                 }
               } catch (e) {}
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


watch([estadoFiltro, orden, itemsPorPagina], () => {
  cargarCursos(1);
});

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
  cargarCursos(nuevaPagina)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const restablecerFiltros = () => {
  estadoFiltro.value = 'Todos';
  orden.value = 'reciente';
  itemsPorPagina.value = 15;
}

// NUEVO: Redirección exclusiva de supervisor
const irDetalle = (id) => {
  router.push(`/supervisor/curso/${id}`)
}

onMounted(() => cargarCursos(1))
</script>
<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] overflow-hidden min-h-screen">

    <div class="bg-[#1b2a4a] py-8 px-6 text-center shadow-md">
      <h1 class="text-3xl font-bold text-[#D1B16D] mb-2">Gestión de Cursos</h1>
      <p class="text-gray-300">Administra, filtra y revisa todos los cursos de la plataforma.</p>
    </div>

    <main class="max-w-7xl mx-auto pt-8 pb-4 px-6">

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        
        <div class="w-full md:w-auto flex items-center gap-4 flex-wrap bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex items-center gap-3">
            <label class="text-[#002855] font-semibold text-sm pl-2">Estado:</label>
            <select 
              v-model="estadoFiltro" 
              class="border border-gray-200 rounded-lg px-3 py-1.5 focus:border-[#b5943a] focus:ring-1 focus:ring-[#b5943a] outline-none cursor-pointer text-sm bg-gray-50 hover:bg-white transition-colors"
            >
              <option value="Todos">Todos</option>
              <option value="0">Pendiente</option>
              <option value="1">Aprobado</option>
              <option value="2">Rechazado</option>
              <option value="3">Archivado</option>
            </select>
          </div>

          <div class="h-6 w-px bg-gray-200 hidden md:block"></div>

          <div class="flex items-center gap-3 pr-2">
            <label class="text-[#002855] font-semibold text-sm">Mostrar:</label>
            <select 
              v-model="itemsPorPagina" 
              class="border border-gray-200 rounded-lg px-3 py-1.5 focus:border-[#b5943a] focus:ring-1 focus:ring-[#b5943a] outline-none cursor-pointer text-sm bg-gray-50 hover:bg-white transition-colors"
            >
              <option v-for="n in opcionesPagina" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>

        <button
          @click="toggleOrden"
          class="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-[#1b2a4a] text-sm font-semibold px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:border-[#D1B16D] hover:text-[#b5943a] hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 group-hover:text-[#D1B16D] transition-transform duration-300"
            :class="orden === 'reciente' ? 'rotate-0' : 'rotate-180'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Orden: <span class="text-gray-600 group-hover:text-[#b5943a] transition-colors">{{ orden === 'reciente' ? 'Más Recientes' : 'Más Antiguos' }}</span></span>
        </button>

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

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CursoPublicoCard
              v-for="curso in cursos"
              :key="curso.id_curso"
              :curso="curso"
              :mostrar-boton-baja="true"
              @ver="irDetalle"
              @dar-baja="abrirModalDarBaja"
            />
          </div>

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

    <ConfirmarBajaCursoModal
      :visible="mostrarModalBaja"
      :curso="cursoSeleccionado"
      @cerrar="mostrarModalBaja = false"
      @confirmar="confirmarDarBaja"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  listarCursosPaginadosPorFecha,
  listarCursosPublicosPaginadosPorFechaPorEstado 
} from '../services/cursoService.js'

// Importamos el servicio del supervisor para hacer el cambio real
import { cambiarEstadoCurso } from '../services/supervisorService.js'

import CursoPublicoCard from '@/components/catalogoCursos/CursoPublicoCard.vue'
import CatalogoCursosPaginacion from '@/components/catalogoCursos/CatalogoCursosPaginacion.vue'
import BotonScroll from '@/components/comunes/BotonScroll.vue'
import ConfirmarBajaCursoModal from '@/components/modals/ConfirmarBajaCursoModal.vue'
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

// Modal dar de baja
const mostrarModalBaja = ref(false)
const cursoSeleccionado = ref(null)

const toggleOrden = () => {
  orden.value = orden.value === 'reciente' ? 'antiguo' : 'reciente';
}

const abrirModalDarBaja = (curso) => {
  cursoSeleccionado.value = curso
  mostrarModalBaja.value = true
}

// LÓGICA DE BACKEND REAL PARA DAR DE BAJA
const confirmarDarBaja = async ({ idCurso, motivo, terminarCarga }) => {
  try {
    // Usamos cambiarEstadoCurso con estado 2 (Rechazado)
    const res = await cambiarEstadoCurso(idCurso, 2, motivo)
    
    if (res.success || res) {
      alert(`✅ Curso dado de baja correctamente\nMotivo: ${motivo}`)
      
      // Si el filtro no es "Todos" ni "Rechazado(2)", desaparece
      if (estadoFiltro.value !== 'Todos' && estadoFiltro.value !== '2') {
        cargarCursos(paginaActual.value)
      } else {
        const index = cursos.value.findIndex(c => c.id_curso === idCurso)
        if (index !== -1) {
          cursos.value[index].estado = 2
        }
      }
    } else {
      alert(res.message || 'Error al intentar dar de baja el curso')
    }
  } catch (error) {
    console.error('Error al dar de baja:', error)
    alert('Hubo un problema de conexión con el servidor.')
  } finally {
    if (terminarCarga) terminarCarga()
    mostrarModalBaja.value = false
  }
}

const cargarCursos = async (pagina = 1) => {
  loading.value = true
  paginaActual.value = pagina
  
  try {
    let response;
    const direccion = orden.value === 'reciente' ? 'abajo' : 'arriba';

    if (estadoFiltro.value === 'Todos') {
      response = await listarCursosPaginadosPorFecha(pagina, itemsPorPagina.value, direccion);
    } else {
      response = await listarCursosPublicosPaginadosPorFechaPorEstado(pagina, itemsPorPagina.value, direccion, estadoFiltro.value);
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

const irDetalle = (id) => {
  router.push(`/supervisor/curso/${id}`)
}

onMounted(() => cargarCursos(1))
</script>
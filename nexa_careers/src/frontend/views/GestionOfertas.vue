<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] min-h-screen">

    <div class="bg-[#1b2a4a] py-8 px-6 text-center shadow-md">
      <h1 class="text-3xl font-bold text-[#D1B16D] mb-2">Gestión de Ofertas</h1>
      <p class="text-gray-300">Revisa y filtra todas las ofertas laborales de la plataforma.</p>
    </div>

    <main class="max-w-7xl mx-auto pt-8 pb-4 px-6">

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        
        <div class="w-full md:w-auto drop-shadow-sm">
          <OfertaFiltros
            :estado="estadoFiltro"
            :items-por-pagina="itemsPorPagina"
            @update:estado="estadoFiltro = $event; cargarOfertas(1)"
            @update:items-por-pagina="itemsPorPagina = $event; cargarOfertas(1)"
          />
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
        Cargando ofertas...
      </div>

      <div v-else-if="ofertas.length === 0" class="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400">
        <p class="text-5xl mb-4">📂</p>
        <p class="text-lg font-medium">No hay ofertas que coincidan con este filtro.</p>
      </div>

      <template v-else>
        <p class="text-sm text-gray-500 mb-6 font-medium">
          Página <span class="text-[#1b2a4a]">{{ paginaActual }}</span> de <span class="text-[#1b2a4a]">{{ totalPaginas }}</span>
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OfertaCard
            v-for="oferta in ofertas"
            :key="oferta.id_oferta"
            :oferta="oferta"
            :mostrar-estado="true"
            :mostrar-boton-baja="true"
            @click-detalle="irDetalle"
            @dar-baja="abrirModalDarBaja"
          />
        </div>
        <CatalogoCursosPaginacion
          v-if="totalPaginas > 1"
          :pagina-actual="paginaActual"
          :total-paginas="totalPaginas"
          @cambiar="cargarOfertas"
        />
      </template>

    </main>

    <ConfirmarBajaOfertaModal
      :visible="mostrarModalBaja"
      :oferta="ofertaSeleccionada"
      @cerrar="mostrarModalBaja = false"
      @confirmar="confirmarDarBaja"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import OfertaFiltros from '@/components/gestionOfertas/OfertaFiltros.vue'
import OfertaCard from '@/components/catalogoOfertas/OfertaCard.vue'
import CatalogoCursosPaginacion from '@/components/catalogoCursos/CatalogoCursosPaginacion.vue'
import ConfirmarBajaOfertaModal from '@/components/modals/ConfirmarBajaOfertaModal.vue'

import { cambiarEstadoOferta } from '@/services/supervisorService.js'
import { obtenerEmpleadorPorId } from '@/services/empleadorService.js'
import { actualizarVencimientos } from '@/services/ofertaService.js'

const router = useRouter()
const route  = useRoute()

const estadoFiltro   = ref(route.query.estado ?? 'Todos')
const itemsPorPagina = ref(Number(route.query.size) || 12)
const paginaActual   = ref(Number(route.query.pagina) || 1)
const totalPaginas   = ref(1)
const ofertas        = ref([])
const loading        = ref(true)

// Variable para el orden
const orden = ref('reciente')

// Modal dar de baja
const mostrarModalBaja = ref(false)
const ofertaSeleccionada = ref(null)

const irDetalle = (id) => router.push(`/supervisor/oferta/${id}`)

const abrirModalDarBaja = (oferta) => {
  ofertaSeleccionada.value = oferta
  mostrarModalBaja.value = true
}

const toggleOrden = () => {
  orden.value = orden.value === 'reciente' ? 'antiguo' : 'reciente';
  cargarOfertas(1);
}

const confirmarDarBaja = async ({ idOferta, motivo, terminarCarga }) => {
  try {
    const res = await cambiarEstadoOferta(idOferta, 2, motivo)
    
    if (res.success || res) {
      alert(`✅ Oferta dada de baja correctamente\nMotivo: ${motivo}`)
      
      if (estadoFiltro.value !== 'Todos' && estadoFiltro.value !== '2') {
        cargarOfertas(paginaActual.value)
      } else {
        const index = ofertas.value.findIndex(o => o.id_oferta === idOferta)
        if (index !== -1) {
          ofertas.value[index].estado = 2
        }
      }
    } else {
      alert(res.message || 'Error al intentar dar de baja la oferta')
    }
  } catch (error) {
    console.error('Error al dar de baja:', error)
    alert('Hubo un problema de conexión con el servidor.')
  } finally {
    if (terminarCarga) terminarCarga()
    mostrarModalBaja.value = false
  }
}

const cargarOfertas = async (pagina = 1) => {
  loading.value = true
  paginaActual.value = pagina
  router.replace({ query: { estado: estadoFiltro.value, size: itemsPorPagina.value, pagina } })
  
  try {
    const direccion = orden.value === 'reciente' ? 'abajo' : 'arriba';
    const API_URL = 'http://localhost:3000/api';
    
    // URL dinámica para respetar el ordenamiento
    const url = estadoFiltro.value === 'Todos'
      ? `${API_URL}/ofertas/pagina/${pagina}/size/${itemsPorPagina.value}/apertura/${direccion}`
      : `${API_URL}/ofertas/pagina/${pagina}/size/${itemsPorPagina.value}/apertura/${direccion}/estado/${estadoFiltro.value}`;

    const resRaw = await fetch(url);
    const res = await resRaw.json();

    if (res.success && res.data) {
      ofertas.value = await Promise.all(res.data.map(async o => {
        let nombre_empresa = '—'
        if (o.id_empleador) {
          const emp = await obtenerEmpleadorPorId(o.id_empleador)
          if (emp.success && emp.data) nombre_empresa = emp.data.empresa || emp.data.nombre || '—'
        }
        return { ...o, nombre_empresa }
      }))
      totalPaginas.value = res.paginas ?? 1
    } else {
      ofertas.value = []
      totalPaginas.value = 1
    }
  } catch (e) {
    console.error('Error al cargar ofertas:', e)
    ofertas.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await actualizarVencimientos();
  } catch (e) {
    console.error('Error al actualizar vencimientos:', e)
  }
  await cargarOfertas(paginaActual.value)
})
</script>
<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <header class="bg-[#1b2a4a] text-white py-16 px-8 text-center">
      <h1 class="text-4xl font-extrabold mb-4">Encuentra tu próximo desafío profesional</h1>
      <p class="text-[#d0b06d] max-w-2xl mx-auto mb-8">
        Explora las mejores oportunidades laborales dentro de la red Nexa.
      </p>

      <div class="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1 w-full bg-white p-2 rounded-xl shadow-2xl flex gap-2">
          <div class="flex-1 flex items-center px-4 gap-2">
            <span class="text-gray-400">🔍</span>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por título en esta página..."
              class="w-full py-3 text-slate-800 outline-none text-sm rounded-lg"
            />
          </div>
          <button
            @click="cargarOfertas(1)"
            class="bg-[#1b2a4a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0f1a2e] transition-colors"
          >
            Buscar
          </button>
        </div>
        
        <button
          @click="toggleOrden"
          :class="ordenadoPorFecha ? 'bg-[#d0b06d] text-[#1b2a4a]' : 'bg-transparent border border-[#d0b06d] text-[#d0b06d]'"
          class="px-6 py-4 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-2 hover:brightness-110"
        >
          📅 {{ ordenadoPorFecha ? 'Más recientes primero' : 'Ordenar por fecha' }}
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-12 px-6">

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando ofertas...
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="cargarOfertas(1)" class="bg-[#1b2a4a] text-white px-6 py-3 rounded-lg">
          Reintentar
        </button>
      </div>

      <template v-else>

        <div v-if="ofertasFiltradas.length === 0" class="text-center py-20 text-gray-500">
          No se encontraron ofertas.
        </div>

        <template v-else>

          <p class="text-sm text-gray-500 mb-6">
            Página <span class="font-semibold text-[#1b2a4a]">{{ paginaActual }}</span> de <span class="font-semibold text-[#1b2a4a]">{{ totalPaginas }}</span>
            <span v-if="totalOfertasBackend > 0">
              (Total en el sistema: {{ totalOfertasBackend }} ofertas)
            </span>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="oferta in ofertasFiltradas"
              :key="oferta.id_oferta"
              class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              @click="verDetalle(oferta.id_oferta)"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-[#1b2a4a]/10 rounded-lg flex items-center justify-center text-2xl">
                  💼
                </div>
                <span
                  v-if="esNueva(oferta.fecha_apertura)"
                  class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full"
                >
                  Nueva
                </span>
              </div>

              <h2 class="text-lg font-bold text-[#1b2a4a] hover:text-[#b89b4d] transition-colors">
                {{ oferta.oferta }}
              </h2>

              <p class="text-sm text-gray-500 line-clamp-3 my-3">
                {{ oferta.descripcion || 'Sin descripción' }}
              </p>

              <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <span class="text-xs text-gray-400">
                  {{ formatearFecha(oferta.fecha_apertura) }}
                </span>
                <span class="text-[#1b2a4a] font-bold text-sm hover:underline">
                  Ver detalle →
                </span>
              </div>
            </div>
          </div>

          <CatalogoCursosPaginacion
            :pagina-actual="paginaActual"
            :total-paginas="totalPaginas"
            @cambiar="cambiarPagina"
          />

        </template>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarOfertasPaginadasPorEstado, obtenerOfertasPaginacionPorEstadoYFecha } from '../services/ofertaService.js'
import CatalogoCursosPaginacion from '../components/catalogoCursos/CatalogoCursosPaginacion.vue'

const limite = ref(15);


const router   = useRouter()
const loading  = ref(true)
const error    = ref(null)
const ofertas  = ref([])
const busqueda = ref('')

// Variables de Paginación controladas por el Backend
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalOfertasBackend = ref(0)

// Estado del nuevo botón de orden
const ordenadoPorFecha = ref(false)

// Filtro de búsqueda local para las 15 ofertas en pantalla
const ofertasFiltradas = computed(() =>
  ofertas.value.filter(o => {
    return !busqueda.value || o.oferta.toLowerCase().includes(busqueda.value.toLowerCase())
  })
)

// NUEVO: Función que alterna el orden y recarga desde la página 1
const toggleOrden = () => {
  ordenadoPorFecha.value = !ordenadoPorFecha.value
  cargarOfertas(1)
}

// CORRECCIÓN: Ahora sí pide los datos nuevos al backend al cambiar de página
const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
  cargarOfertas(nuevaPagina) // Llama al servidor con el nuevo número de página
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const verDetalle = (id) => router.push(`/ofertas/${id}`)

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no especificada'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const esNueva = (fecha) => {
  if (!fecha) return false
  const diffDias = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  return diffDias <= 7
}

// Lógica principal de conexión
const cargarOfertas = async (pagina = 1) => {
  loading.value = true;
  paginaActual.value = pagina;

  try {
    let response;
    // Pasamos paginaActual, el estado (1) y nuestro limite (15)
    if (ordenadoPorFecha.value) {
      response = await obtenerOfertasPaginacionPorEstadoYFecha(paginaActual.value, 1, limite.value);
    } else {
      response = await listarOfertasPaginadasPorEstado(paginaActual.value, 1, limite.value);
    }

    if (response.success) {
      ofertas.value = response.data; // Las 15 (o menos) ofertas de esta página
      totalPaginas.value = response.paginas; // El número dinámico (ej. 3 páginas)
    }
  } catch (err) {
    error.value = 'Error de comunicación';
  } finally {
    loading.value = false;
  }
};

onMounted(() => cargarOfertas(1))
</script>
<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] overflow-hidden">

    <OfertasHeader v-model:busqueda="busqueda" :ordenado-por-fecha="ordenadoPorFecha" @buscar="cargarOfertas(1)"
      @toggle-orden="toggleOrden" />

    <main class="max-w-7xl mx-auto pt-12 pb-4 px-6">
      <div v-if="!loading && !error && ofertasFiltradas.length > 0" class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <p class="text-sm text-gray-500">
          Página <span class="font-semibold text-[#1b2a4a]">{{ paginaActual }}</span> de <span
            class="font-semibold text-[#1b2a4a]">{{ totalPaginas }}</span>
        </p>

        <div class="flex items-center gap-3">
          <label for="pageSize" class="text-[#002855] font-semibold text-sm">
            Ofertas por página:
          </label>
          <select 
            id="pageSize" 
            v-model="limite"
            class="border-2 border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#b5943a] transition-colors cursor-pointer"
          >
            <option v-for="n in opcionesPagina" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>
      </div>

      <OfertaGrid :ofertas="ofertasFiltradas" :loading="loading" :error="error"
        @reintentar="cargarOfertas(paginaActual)" @ver-detalle="verDetalle" />

      <CatalogoOfertasPaginacion id="punto-final" v-if="!loading && !error && ofertasFiltradas.length > 0"
        :pagina-actual="paginaActual" :total-paginas="totalPaginas" @cambiar="cambiarPagina" />
    </main>
    <div class="min-h-screen bg-[#f8f5f0]">
      <BotonScroll />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { listarOfertasPaginadasPorEstado, obtenerOfertasPaginacionPorEstadoYFecha } from '../services/ofertaService.js'

// Importación de Componentes Atómicos
import OfertasHeader from '../components/catalogoOfertas/OfertasHeader.vue'
import OfertaGrid from '../components/catalogoOfertas/OfertaGrid.vue'
import CatalogoOfertasPaginacion from '../components/catalogoOfertas/CatalogoOfertasPaginacion.vue'

// importar componente de botonscroll
import BotonScroll from '../components/comunes/BotonScroll.vue'

// --- Configuración y Estado ---
const limite = ref(15)
const opcionesPagina = [9, 12, 15, 18, 21, 24, 27, 30] 
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const ofertas = ref([])
const busqueda = ref('')
const paginaActual = ref(1)
const totalPaginas = ref(1)
const ordenadoPorFecha = ref(false)

// --- Lógica de Filtrado Local ---
const ofertasFiltradas = computed(() =>
  ofertas.value.filter(o =>
    !busqueda.value || o.oferta.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

// --- Acciones ---
const toggleOrden = () => {
  ordenadoPorFecha.value = !ordenadoPorFecha.value
  cargarOfertas(1)
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
  cargarOfertas(nuevaPagina)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const verDetalle = (id) => router.push(`/ofertas/${id}`)

// --- Comunicación con Backend ---
const cargarOfertas = async (pagina = 1) => {
  loading.value = true
  error.value = null // Limpiar errores previos al reintentar
  paginaActual.value = pagina

  try {
    const response = ordenadoPorFecha.value
      ? await obtenerOfertasPaginacionPorEstadoYFecha(pagina, 1, limite.value)
      : await listarOfertasPaginadasPorEstado(pagina, 1, limite.value)

    if (response.success) {
      ofertas.value = response.data
      totalPaginas.value = response.paginas
    } else {
      error.value = 'No se pudieron cargar las ofertas en este momento.'
    }
  } catch (err) {
    error.value = 'Error de conexión con el servidor'
    console.error(err)
  } finally {
    loading.value = false
  }
}

watch(limite, () => {
  cargarOfertas(1)
})

onMounted(() => cargarOfertas(1))
</script>
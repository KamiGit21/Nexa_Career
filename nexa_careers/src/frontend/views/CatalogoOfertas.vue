<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <header class="bg-[#1b2a4a] text-white py-16 px-8 text-center">
      <h1 class="text-4xl font-extrabold mb-4">Encuentra tu próximo desafío profesional</h1>
      <p class="text-[#d0b06d] max-w-2xl mx-auto mb-8">
        Explora las mejores oportunidades laborales dentro de la red Nexa.
      </p>

      <div class="max-w-2xl mx-auto bg-white p-2 rounded-xl shadow-2xl flex gap-2">
        <div class="flex-1 flex items-center px-4 gap-2">
          <span class="text-gray-400">🔍</span>
          <input v-model="busqueda" type="text" placeholder="Buscar por título..."
            class="w-full py-3 text-slate-800 outline-none text-sm rounded-lg" @keyup.enter="cargarOfertas">
        </div>
        <button @click="cargarOfertas"
          class="bg-[#1b2a4a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0f1a2e] transition-colors">
          Buscar
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-12 px-6">
      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando ofertas...
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="cargarOfertas" class="bg-[#1b2a4a] text-white px-6 py-3 rounded-lg">Reintentar</button>
      </div>

      <div v-else-if="ofertasFiltradas.length === 0" class="text-center py-20 text-gray-500">
        No se encontraron ofertas con los filtros actuales.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="oferta in ofertasFiltradas" :key="oferta.id_oferta"
          class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
          @click="verDetalle(oferta.id_oferta)">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 bg-[#1b2a4a]/10 rounded-lg flex items-center justify-center text-2xl">

            </div>
            <span v-if="esNueva(oferta.fecha_apertura)"
              class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
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
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarOfertas } from '../services/ofertaService.js'

const router = useRouter()
const loading = ref(true)
const error = ref(null)
const ofertas = ref([])
const busqueda = ref('')

// Mostrar solo ofertas disponibles(aprobadas) en el catalogo (estado = 1).
const ofertasFiltradas = computed(() => {
  return ofertas.value.filter(o => {
    const estaActiva = o.estado === 1
    const coincideBusqueda = !busqueda.value ||
      o.oferta.toLowerCase().includes(busqueda.value.toLowerCase())
    return estaActiva && coincideBusqueda
  })
})

const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no especificada'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES')
}

const esNueva = (fecha) => {
  if (!fecha) return false
  const fechaOferta = new Date(fecha)
  const hoy = new Date()
  const diffDias = Math.floor((hoy - fechaOferta) / (1000 * 60 * 60 * 24))
  return diffDias <= 7
}

const verDetalle = (id) => {
  router.push(`/ofertas/${id}`)
}

const cargarOfertas = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await listarOfertas()
    console.log('Ofertas cargadas:', response)

    if (response.success) {
      // Mostrar solo ofertas activas (estado = 1) o pendientes (estado = 0)
      // Según tu backend: 0 = pendiente, 1 = aprobada
      ofertas.value = response.data.filter(o => o.estado === 0 || o.estado === 1)
    } else {
      error.value = response.message || 'Error al cargar ofertas'
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Error de conexión con el servidor'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarOfertas()
})
</script>
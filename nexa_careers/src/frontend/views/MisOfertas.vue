<!-- src/frontend/views/MisOfertas.vue -->
<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Ofertas</h1>
          <p class="text-gray-500 mt-1">Gestiona las oportunidades que has publicado</p>
        </div>
        <router-link
          to="/mis-ofertas/nueva"
          class="px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium
                 flex items-center gap-2 hover:bg-[#0f1a2e] transition-colors"
        >
          + Nueva Oferta
        </router-link>
      </div>

      <MisOfertasGrid
        :ofertas="ofertas"
        :loading="loading"
        @ver-detalle="(o) => router.push(`/ofertas/${o.id_oferta}`)"
        @editar="(o) => router.push(`/mis-ofertas/${o.id_oferta}/editar`)"
        @dar-de-baja="prepararBaja"
      />

    </div>

    <ConfirmarBajaOfertaModal
      :visible="modalBajaVisible"
      :nombre-oferta="ofertaSeleccionada?.oferta || ''"
      :cargando="procesando"
      :error="errorBaja"
      @cancelar="cerrarModal"
      @confirmar="confirmarBaja"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MisOfertasGrid           from '../components/misOfertas/MisOfertasGrid.vue'
import ConfirmarBajaOfertaModal from '../components/misOfertas/ConfirmarBajaOfertaModal.vue'
import { listarOfertasPorEmpleador, darDeBajaOferta } from '../services/ofertaService.js'
import { obtenerNumeroPostulacionesPorOferta } from '../services/postulacionService.js'

const router             = useRouter()
const ofertas            = ref([])
const loading            = ref(true)
const ofertaSeleccionada = ref(null)
const modalBajaVisible   = ref(false)
const procesando         = ref(false)
const errorBaja          = ref('')

const cerrarModal  = () => { modalBajaVisible.value = false; ofertaSeleccionada.value = null; errorBaja.value = '' }
const prepararBaja = (o) => { ofertaSeleccionada.value = o; errorBaja.value = ''; modalBajaVisible.value = true }

const confirmarBaja = async () => {
  procesando.value = true
  try {
    const res = await darDeBajaOferta(ofertaSeleccionada.value.id_oferta)
    if (res.success) {
      const idx = ofertas.value.findIndex(o => o.id_oferta === ofertaSeleccionada.value.id_oferta)
      if (idx !== -1) ofertas.value[idx].estado = 3
      cerrarModal()
    } else {
      errorBaja.value = res.message || 'No se pudo dar de baja la oferta.'
    }
  } catch {
    errorBaja.value = 'Error de conexión con el servidor.'
  } finally {
    procesando.value = false
  }
}

const cargarOfertas = async () => {
  loading.value = true
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion'))
    if (!sesion || sesion.rol !== 'empleador') { router.push('/login'); return }
    const res = await listarOfertasPorEmpleador(sesion.id)
    if (res.success) {
      ofertas.value = await Promise.all(
        (res.data || []).map(async (o) => ({
          ...o,
          postulantes_count: await obtenerNumeroPostulacionesPorOferta(o.id_oferta)
        }))
      )
    }
  } catch (e) {
    console.error('Error al cargar ofertas:', e)
  } finally {
    loading.value = false
  }
}

onMounted(cargarOfertas)
</script>
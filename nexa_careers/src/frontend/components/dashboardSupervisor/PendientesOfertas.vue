<template>
  <div>
    <p class="text-gray-500 text-sm mb-6">
      Ofertas laborales que esperan tu aprobación para aparecer en el catálogo.
    </p>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      Cargando ofertas pendientes...
    </div>

    <div v-else-if="pendientes.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">✅</p>
      <p class="font-medium">No hay ofertas pendientes</p>
      <p class="text-sm mt-1">Todas las ofertas han sido revisadas</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ModerarItemCard
        v-for="oferta in pendientes"
        :key="oferta.id_oferta"
        :item="mapearOferta(oferta)"
        :cargando="procesando === oferta.id_oferta"
        @accion="({ id, estado, rechazo }) => moderarOferta(id, estado, rechazo)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModerarItemCard from './ModerarItemCard.vue'
import { listarOfertasPendientes, cambiarEstadoOferta } from '../../services/supervisorService.js'

const pendientes = ref([])
const loading    = ref(true)
const procesando = ref(null)

const mapearOferta = (oferta) => ({
  id:          oferta.id_oferta,
  titulo:      oferta.oferta,
  descripcion: oferta.descripcion,
  fecha:       oferta.fecha_apertura,
  tipo:        'Empleador',
  publicador:  oferta.empresa || '—'
})

const cargar = async () => {
  loading.value = true
  try {
    const res = await listarOfertasPendientes()
    if (res.success) pendientes.value = res.data
  } catch (e) {
    console.error('Error al cargar ofertas pendientes:', e)
  } finally {
    loading.value = false
  }
}

const moderarOferta = async (id, estado, rechazo) => {
  procesando.value = id
  try {
    const res = await cambiarEstadoOferta(id, estado, rechazo)
    if (res.success) pendientes.value = pendientes.value.filter(o => o.id_oferta !== id)
  } catch (e) {
    console.error('Error al moderar oferta:', e)
  } finally {
    procesando.value = null
  }
}

onMounted(cargar)
</script>
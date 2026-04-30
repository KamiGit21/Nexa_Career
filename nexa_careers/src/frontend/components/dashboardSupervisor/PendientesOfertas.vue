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

    <div v-else-if="ofertasFiltradas.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">🔍</p>
      <p class="font-medium">No se encontraron ofertas</p>
      <p class="text-sm mt-1">Prueba con otro término de búsqueda</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ModerarItemCard
        v-for="oferta in ofertasFiltradas"
        :key="oferta.id_oferta"
        :item="mapearOferta(oferta)"
        :cargando="procesando === oferta.id_oferta"
        tipoContenido="oferta"
        @accion="({ id, estado, rechazo }) => moderarOferta(id, estado, rechazo)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ModerarItemCard from './ModerarItemCard.vue'
import { listarOfertasPendientes, cambiarEstadoOferta } from '../../services/supervisorService.js'
import { obtenerEmpleadorPorId } from '../../services/empleadorService.js'

const emit = defineEmits(['update:count'])

const pendientes = ref([])
const loading    = ref(true)
const procesando = ref(null)

const props = defineProps({
  filtro: { type: String, default: '' }
})

const ofertasFiltradas = computed(() => {
  const search = props.filtro.toLowerCase().trim()
  const result = [...pendientes.value].sort(
    (a, b) => new Date(b.fecha_apertura) - new Date(a.fecha_apertura)
  )
  if (!search) return result
  return result.filter(o =>
    o.oferta?.toLowerCase().includes(search) ||
    o.nombre_empresa?.toLowerCase().includes(search)
  )
})

const mapearOferta = (oferta) => ({
  id:          oferta.id_oferta,
  titulo:      oferta.oferta,
  descripcion: oferta.descripcion,
  fecha:       oferta.fecha_apertura,
  tipo:        'Empleador',
  publicador:  oferta.nombre_empresa || oferta.id_empleador || '—'
})

const cargar = async () => {
  loading.value = true
  try {
    const res = await listarOfertasPendientes()
    if (res.success && res.data) {
      const ofertasConEmpleador = await Promise.all(
        res.data.map(async (oferta) => {
          let nombreEmpresa = 'Empresa Desconocida'
          if (oferta.id_empleador) {
            try {
              const empRes = await obtenerEmpleadorPorId(oferta.id_empleador)
              if (empRes.success && empRes.data) {
                nombreEmpresa = empRes.data.empresa || empRes.data.nombre || 'Sin nombre registrado'
              }
            } catch (err) {
              console.error(`Error al obtener empleador ${oferta.id_empleador}:`, err)
            }
          }
          return { ...oferta, nombre_empresa: nombreEmpresa }
        })
      )
      pendientes.value = ofertasConEmpleador
      emit('update:count', ofertasConEmpleador.length)
    } else {
      pendientes.value = []
    }
  } catch (e) {
    console.error('Error al cargar ofertas pendientes:', e)
    pendientes.value = []
  } finally {
    loading.value = false
  }
}

const moderarOferta = async (id, estado, rechazo) => {
  procesando.value = id
  try {
    const res = await cambiarEstadoOferta(id, estado, rechazo)
    if (res.success) {
      pendientes.value = pendientes.value.filter(o => o.id_oferta !== id)
      emit('update:count', pendientes.value.length)
    }
  } catch (e) {
    console.error('Error al moderar oferta:', e)
  } finally {
    procesando.value = null
  }
}

onMounted(cargar)
</script>
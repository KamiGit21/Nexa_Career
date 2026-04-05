<template>
  <div class="min-h-screen bg-[#F5F0E8] p-8">
    <EmpleadoresHeader
      :total="empleadores.length"
      v-model:busqueda="busqueda"
    />

    <div v-if="loading" class="text-center py-20 text-gray-500">Cargando empleadores...</div>

    <EmpleadoresTabla
      v-else
      :empleadores="empleadoresFiltrados"
      @ver="abrirDetalle"
    />

    <DetalleEmpleadorModal
      :empleador="seleccionado"
      :logs="logs"
      :cargando-logs="cargandoLogs"
      @cerrar="seleccionado = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmpleadoresHeader      from '../components/listaEmpleadores/EmpleadoresHeader.vue'
import EmpleadoresTabla       from '../components/listaEmpleadores/EmpleadoresTabla.vue'
import DetalleEmpleadorModal  from '../components/listaEmpleadores/DetalleEmpleadorModal.vue'
import { listarEmpleadoresAdmin, obtenerLogsEmpleador } from '../services/supervisorService.js'

const empleadores  = ref([])
const loading      = ref(true)
const busqueda     = ref('')
const seleccionado = ref(null)
const logs         = ref([])
const cargandoLogs = ref(false)

const empleadoresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return empleadores.value
  const q = busqueda.value.toLowerCase()
  return empleadores.value.filter(e =>
    e.empresa?.toLowerCase().includes(q) ||
    e.gmail?.toLowerCase().includes(q)
  )
})

const abrirDetalle = async (emp) => {
  seleccionado.value = emp
  logs.value = []
  cargandoLogs.value = true
  try {
    const res = await obtenerLogsEmpleador(emp.id_empleador)
    if (res.success) logs.value = res.data
  } finally {
    cargandoLogs.value = false
  }
}

onMounted(async () => {
  try {
    const res = await listarEmpleadoresAdmin()
    if (res.success) empleadores.value = res.data
  } finally {
    loading.value = false
  }
})
</script>
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
      @bloquear="abrirModalBloqueo"
    />

    <DetalleEmpleadorModal
      :empleador="seleccionado"
      :logs="logs"
      :cargando-logs="cargandoLogs"
      @cerrar="seleccionado = null"
    />

    <ConfirmarBloqueoModal
      :visible="modalVisible"
      :tipo-usuario="'Empleador'"
      :nombre-usuario="usuarioABloquear?.empresa"
      :id-usuario="usuarioABloquear?.id_empleador"
      @cerrar="modalVisible = false"
      @confirmar="confirmarBloqueo"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmpleadoresHeader      from '../components/listaEmpleadores/EmpleadoresHeader.vue'
import EmpleadoresTabla       from '../components/listaEmpleadores/EmpleadoresTabla.vue'
import DetalleEmpleadorModal  from '../components/listaEmpleadores/DetalleEmpleadorModal.vue'
import ConfirmarBloqueoModal  from '../components/modals/ConfirmarBloqueoModal.vue'
import { listarEmpleadoresAdmin, obtenerLogsEmpleador, bloquearUsuario } from '../services/supervisorService.js'

const empleadores  = ref([])
const loading      = ref(true)
const busqueda     = ref('')
const seleccionado = ref(null)
const logs         = ref([])
const cargandoLogs = ref(false)

// Bloqueo
const modalVisible = ref(false)
const usuarioABloquear = ref(null)

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

const abrirModalBloqueo = (usuario) => {
  usuarioABloquear.value = usuario
  modalVisible.value = true
}

const confirmarBloqueo = async ({ id, motivo }) => {
  const res = await bloquearUsuario('empleador', id, motivo)
  if (res.success) {
    alert('Empleador bloqueado correctamente')
    await cargarEmpleadores()
  } else {
    alert('Error al bloquear: ' + res.message)
  }
  modalVisible.value = false
  usuarioABloquear.value = null
}

const cargarEmpleadores = async () => {
  loading.value = true
  try {
    const res = await listarEmpleadoresAdmin()
    if (res.success) empleadores.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarEmpleadores()
})
</script>
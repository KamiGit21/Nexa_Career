<template>
  <div class="min-h-screen bg-[#F5F0E8] p-8">
    <EstudiantesHeader
      :total="estudiantes.length"
      v-model:busqueda="busqueda"
    />

    <div v-if="loading" class="text-center py-20 text-gray-500">Cargando estudiantes...</div>

    <EstudiantesTabla
      v-else
      :estudiantes="estudiantesFiltrados"
      @ver="abrirDetalle"
      @bloquear="abrirModalBloqueo"
    />

    <DetalleEstudianteModal
      :estudiante="seleccionado"
      :logs="logs"
      :cargando-logs="cargandoLogs"
      @cerrar="seleccionado = null"
    />

    <ConfirmarBloqueoModal
      :visible="modalVisible"
      :tipo-usuario="'Estudiante'"
      :nombre-usuario="usuarioABloquear?.nombre + ' ' + usuarioABloquear?.apellido"
      :id-usuario="usuarioABloquear?.id_estudiante"
      @cerrar="modalVisible = false"
      @confirmar="confirmarBloqueo"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EstudiantesHeader      from '../components/listaEstudiantes/EstudiantesHeader.vue'
import EstudiantesTabla       from '../components/listaEstudiantes/EstudiantesTabla.vue'
import DetalleEstudianteModal from '../components/listaEstudiantes/DetalleEstudianteModal.vue'
import ConfirmarBloqueoModal  from '../components/modals/ConfirmarBloqueoModal.vue'
import { listarEstudiantesAdmin, obtenerLogsEstudiante, bloquearUsuario } from '../services/supervisorService.js'

const estudiantes  = ref([])
const loading      = ref(true)
const busqueda     = ref('')
const seleccionado = ref(null)
const logs         = ref([])
const cargandoLogs = ref(false)

// bloquear
const modalVisible = ref(false)
const usuarioABloquear = ref(null)

const estudiantesFiltrados = computed(() => {
  if (!busqueda.value.trim()) return estudiantes.value
  const q = busqueda.value.toLowerCase()
  return estudiantes.value.filter(e =>
    `${e.nombre} ${e.apellido}`.toLowerCase().includes(q) ||
    e.gmail?.toLowerCase().includes(q)
  )
})

const abrirDetalle = async (estudiante) => {
  seleccionado.value = estudiante
  logs.value = []
  cargandoLogs.value = true
  try {
    const res = await obtenerLogsEstudiante(estudiante.id_estudiante)
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
  const res = await bloquearUsuario('estudiante', id, motivo)
  if (res.success) {
    alert('Estudiante bloqueado correctamente')
    await cargarEstudiantes()
  } else {
    alert('Error al bloquear: ' + res.message)
  }
  modalVisible.value = false
  usuarioABloquear.value = null
}

const cargarEstudiantes = async () => {
  loading.value = true
  try {
    const res = await listarEstudiantesAdmin()
    if (res.success) estudiantes.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarEstudiantes()
})
</script>
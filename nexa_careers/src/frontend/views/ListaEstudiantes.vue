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
      @desbloquear="abrirModalDesbloqueo"
    />

    <DetalleEstudianteModal
      :estudiante="seleccionado"
      :logs="logs"
      :cargando-logs="cargandoLogs"
      @cerrar="seleccionado = null"
    />

    <ConfirmarBloqueoModal
      :visible="modalBloqueoVisible"
      tipo-usuario="Estudiante"
      :nombre-usuario="`${usuarioABloquear?.nombre} ${usuarioABloquear?.apellido}`"
      :id-usuario="usuarioABloquear?.id_estudiante"
      @cerrar="modalBloqueoVisible = false"
      @confirmar="confirmarBloqueo"
    />

    <DesbloquearEstudianteModal
      :visible="modalDesbloqueoVisible"
      :estudiante="usuarioADesbloquear"
      @cerrar="modalDesbloqueoVisible = false"
      @desbloqueado="onDesbloqueado"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted }   from 'vue'
import EstudiantesHeader              from '../components/listaEstudiantes/EstudiantesHeader.vue'
import EstudiantesTabla               from '../components/listaEstudiantes/EstudiantesTabla.vue'
import DetalleEstudianteModal         from '../components/listaEstudiantes/DetalleEstudianteModal.vue'
import ConfirmarBloqueoModal          from '../components/modals/ConfirmarBloqueoModal.vue'
import DesbloquearEstudianteModal     from '../components/modals/DesbloquearEstudianteModal.vue'
import { listarEstudiantesAdmin, obtenerLogsEstudiante, bloquearUsuario } from '../services/supervisorService.js'

const estudiantes         = ref([])
const loading             = ref(true)
const busqueda            = ref('')
const seleccionado        = ref(null)
const logs                = ref([])
const cargandoLogs        = ref(false)
const modalBloqueoVisible    = ref(false)
const usuarioABloquear       = ref(null)
const modalDesbloqueoVisible = ref(false)
const usuarioADesbloquear    = ref(null)

const cargarEstudiantes = async () => {
  loading.value = true
  try {
    const res = await listarEstudiantesAdmin()
    if (res.success) estudiantes.value = res.data
  } finally {
    loading.value = false
  }
}

const estudiantesFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return estudiantes.value
  return estudiantes.value.filter(e =>
    `${e.nombre} ${e.apellido}`.toLowerCase().includes(q) ||
    e.gmail?.toLowerCase().includes(q)
  )
})

const abrirDetalle = async (e) => {
  seleccionado.value = e
  logs.value         = []
  cargandoLogs.value = true
  try {
    const res = await obtenerLogsEstudiante(e.id_estudiante)
    if (res.success) logs.value = res.data
  } finally {
    cargandoLogs.value = false
  }
}

const abrirModalBloqueo    = (u) => { usuarioABloquear.value = u; modalBloqueoVisible.value = true }
const abrirModalDesbloqueo = (u) => { usuarioADesbloquear.value = u; modalDesbloqueoVisible.value = true }

const confirmarBloqueo = async ({ id, motivo }) => {
  const res = await bloquearUsuario('estudiante', id, motivo || 'Sin motivo especificado')
  if (res.success) { 
    alert('Estudiante bloqueado correctamente'); await cargarEstudiantes() 
  }else {
    alert('Error al bloquear: ' + res.message)
  }
  modalBloqueoVisible.value = false
  usuarioABloquear.value    = null
}

const onDesbloqueado = async () => {
  alert('Estudiante desbloqueado correctamente')
  await cargarEstudiantes()
}

onMounted(cargarEstudiantes)
</script>
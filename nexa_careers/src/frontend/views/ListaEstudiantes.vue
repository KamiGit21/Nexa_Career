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
    />

    <DetalleEstudianteModal
      :estudiante="seleccionado"
      :logs="logs"
      :cargando-logs="cargandoLogs"
      @cerrar="seleccionado = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EstudiantesHeader      from '../components/listaEstudiantes/EstudiantesHeader.vue'
import EstudiantesTabla       from '../components/listaEstudiantes/EstudiantesTabla.vue'
import DetalleEstudianteModal from '../components/listaEstudiantes/DetalleEstudianteModal.vue'
import { listarEstudiantesAdmin, obtenerLogsEstudiante } from '../services/supervisorService.js'

const estudiantes  = ref([])
const loading      = ref(true)
const busqueda     = ref('')
const seleccionado = ref(null)
const logs         = ref([])
const cargandoLogs = ref(false)

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

onMounted(async () => {
  try {
    const res = await listarEstudiantesAdmin()
    if (res.success) estudiantes.value = res.data
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando curso...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20 text-red-400">
        <p class="text-5xl mb-4">⚠️</p>
        <p class="text-lg font-medium">{{ error }}</p>
        <router-link :to="rutaVolver" class="text-sm text-[#2e6da4] hover:underline mt-3 inline-block">
          ← Volver
        </router-link>
      </div>

      <!-- Contenido -->
      <div v-else-if="curso">

        <!-- Badge para supervisor si el curso está pendiente -->
        <div v-if="esSupervisor && curso.estado === 0" class="mb-4">
          <div
            class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="text-yellow-600 text-xl">⏳</span>
              <span class="text-sm text-yellow-700">Este curso está en revisión pendiente</span>
            </div>
            <div class="flex gap-2">
              <button @click="moderarCurso(1)"
                class="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                ✓ Aprobar
              </button>
              <button @click="abrirModalRechazo"
                class="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
                ✗ Rechazar
              </button>
            </div>
          </div>
        </div>

        <DetalleCursoHeader :curso="curso" />

        <div class="flex flex-col lg:flex-row gap-6 items-start">

          <!-- Columna principal -->
          <div class="flex-1 min-w-0">
            <DetalleCursoInfo :curso="curso" />


            <DetalleCursoContacto :curso="curso" />
          </div>

          <!-- Sidebar -->
          <div class="w-full lg:w-72 flex-shrink-0">
            <DetalleCursoSidebar :curso="curso" />
          </div>

        </div>

      </div>

    </div>
  </div>

  <!-- Modal de rechazo -->
  <Transition name="modal-fade">
    <div v-if="mostrarModalRechazo"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      @click.self="cerrarModalRechazo">
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">
        <div class="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
          ❌
        </div>
        <div>
          <h2 class="text-xl font-bold text-[#1b2a4a]">Rechazar curso</h2>
          <p class="text-sm text-gray-500 mt-1">
            Ingresa el motivo del rechazo para "{{ curso?.curso }}"
          </p>
        </div>
        <div class="text-left">
          <input v-model="motivoRechazo" type="text"
            placeholder="Ej. Contenido inapropiado, información insuficiente..."
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all" />
        </div>
        <div class="flex gap-3 pt-1">
          <button @click="cerrarModalRechazo"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button @click="confirmarRechazo" :disabled="!motivoRechazo.trim()"
            class="flex-1 py-2.5 bg-red-500 rounded-xl text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50">
            Rechazar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerCursoPorId } from '../services/cursoService.js'
import { cambiarEstadoCurso } from '../services/supervisorService.js'
import DetalleCursoHeader from '../components/detalleCurso/DetalleCursoHeader.vue'
import DetalleCursoInfo from '../components/detalleCurso/DetalleCursoInfo.vue'
import DetalleCursoContacto from '../components/detalleCurso/DetalleCursoContacto.vue'
import DetalleCursoSidebar from '../components/detalleCurso/DetalleCursoSidebar.vue'

const route = useRoute()
const router = useRouter()
const curso = ref(null)
const loading = ref(true)
const error = ref(null)
const mostrarModalRechazo = ref(false)
const motivoRechazo = ref('')

// Verificar si el usuario es supervisor
const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
const esSupervisor = computed(() => sesion.rol === 'supervisor')

// Ruta de volver según rol
const rutaVolver = computed(() => {
  if (sesion.rol === 'supervisor') {
    return '/dashboard-supervisor'
  }
  return '/cursos'
})

const irAlPerfil = (id, tipo) => {
  if (tipo === 0) {
    router.push(`/estudiante/${id}`)
  } else {
    router.push(`/empleador/${id}`)
  }
}

const cargarCurso = async () => {
  try {
    const response = await obtenerCursoPorId(route.params.id)
    if (response.success) {
      curso.value = response.data
    } else {
      error.value = 'No se encontró el curso solicitado.'
    }
  } catch (e) {
    console.error('Error al cargar el curso:', e)
    error.value = 'No se pudo cargar el curso. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const moderarCurso = async (estado) => {
  if (!curso.value) return

  try {
    const response = await cambiarEstadoCurso(curso.value.id_curso, estado, null)
    if (response.success) {
      // Volver al dashboard del supervisor
      router.push('/dashboard-supervisor')
    } else {
      alert('Error al moderar el curso: ' + (response.message || 'Intenta de nuevo'))
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión al moderar el curso')
  }
}

const abrirModalRechazo = () => {
  motivoRechazo.value = ''
  mostrarModalRechazo.value = true
}

const cerrarModalRechazo = () => {
  mostrarModalRechazo.value = false
}

const confirmarRechazo = async () => {
  if (!motivoRechazo.value.trim() || !curso.value) return

  try {
    const response = await cambiarEstadoCurso(curso.value.id_curso, 2, motivoRechazo.value)
    if (response.success) {
      router.push('/dashboard-supervisor')
    } else {
      alert('Error al rechazar el curso: ' + (response.message || 'Intenta de nuevo'))
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión al rechazar el curso')
  }
}

onMounted(() => {
  cargarCurso()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
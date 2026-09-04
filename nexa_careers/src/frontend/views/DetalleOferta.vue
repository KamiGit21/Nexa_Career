<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Loading -->
      <div v-if="cargando" class="text-center py-20 text-gray-500">
        Cargando oferta...
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
      <template v-else-if="oferta">

        <!-- Badge para supervisor si la oferta está pendiente -->
        <div v-if="esSupervisor && oferta.estado === 0" class="mb-4">
          <div
            class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="text-yellow-600 text-xl">⏳</span>
              <span class="text-sm text-yellow-700">Esta oferta está en revisión pendiente</span>
            </div>
            <div class="flex gap-2">
              <button @click="moderarOferta(1)"
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

        <!-- Header -->
        <div class="mb-6">
          <router-link :to="rutaVolver" class="text-sm text-[#2e6da4] hover:underline">
            ← Volver
          </router-link>

          <div class="mt-4 flex flex-wrap justify-between items-start gap-4">
            <div class="flex-1 min-w-[260px]">
              <!-- Estado badge -->
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="text-xs font-semibold px-3 py-1 rounded-full" :class="estiloEstado">
                  {{ textoEstado }}
                </span>
              </div>

              <h1 class="text-3xl font-bold text-[#1b2a4a] leading-tight mb-3">
                {{ oferta.oferta }}
              </h1>

              <!-- Empresa -->
              <div class="flex items-center gap-2 flex-wrap text-sm text-gray-500">
                <span>Publicado por:</span>
                <div class="flex items-center gap-1.5">
                  <div
                    class="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                    {{ inicialEmpresa }}
                  </div>
                  <span @click="irAlPerfil"
                    class="font-semibold text-gray-700 hover:text-[#b5943a] cursor-pointer transition-colors duration-200">
                    {{ nombreEmpresa }}
                  </span>
                  <span class="text-gray-400">· Empleador</span>
                </div>
              </div>

              <p class="text-xs text-gray-400 mt-2">
                Fecha de apertura: {{ formatearFecha(oferta.fecha_apertura) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Cuerpo -->
        <div class="flex flex-col lg:flex-row gap-6 items-start">

          <!-- Columna principal -->
          <div class="flex-1 min-w-0">

            <!-- Descripción -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
              <h2 class="text-lg font-bold text-[#1b2a4a] mb-3">Descripción del puesto</h2>
              <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {{ oferta.descripcion || 'Sin descripción disponible.' }}
              </p>

              <!-- Modalidad si existe -->
              <div v-if="oferta.modalidad" class="mt-5">
                <h3 class="text-sm font-bold text-[#1b2a4a] mb-2">Modalidad</h3>
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  {{ oferta.modalidad }}
                </span>
              </div>

              <!-- Motivo de rechazo -->
              <div v-if="oferta.rechazo || oferta.motivo_rechazo"
                class="mt-5 p-4 bg-red-50 border border-red-100 rounded-xl">
                <h3 class="text-sm font-bold text-red-700 mb-1">Motivo de rechazo</h3>
                <p class="text-sm text-red-600">{{ oferta.rechazo || oferta.motivo_rechazo }}</p>
              </div>

              <!-- Categorías de la oferta -->
              <div v-if="oferta.categorias && oferta.categorias.length > 0" class="mt-5">
                <h3 class="text-sm font-bold text-[#1b2a4a] mb-2">Categoría(s)</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="cat in oferta.categorias" :key="cat.id_categoria"
                    class="text-xs font-semibold px-3 py-1 rounded-full bg-[#1b2a4a]/10 text-[#1b2a4a]">
                    📂 {{ cat.categoria }}
                  </span>
                </div>
              </div>

              <div class="mt-5 pt-5 border-t border-gray-100">
                <h3 class="text-sm font-bold text-[#1b2a4a] mb-3">Sobre el ofertante</h3>
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                    {{ inicialEmpresa }}
                  </div>
                  <div @click="irAlPerfil"
                    class="cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors duration-200">
                    <p class="font-semibold text-gray-800">{{ nombreEmpresa }}</p>
                    <p class="text-xs text-gray-400 capitalize">Empleador activo en Nexa Careers</p>
                  </div>
                </div>
              <div v-if="esSupervisor" class="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 class="text-lg font-bold text-[#1b2a4a]">Editar categorías</h3>
                    <p class="text-sm text-gray-500">Ajusta las etiquetas de esta oferta antes de aprobarla.</p>
                  </div>
                  <button
                    type="button"
                    @click="mostrarModalConfirmarCategorias = true"
                    class="px-4 py-2 bg-[#1b2a4a] text-white rounded-xl hover:bg-[#0f1a2e] transition"
                  >
                    Guardar categorías
                  </button>
                </div>
                <CategoriaOfertaSelect v-model="categoriaIds" />
                <p v-if="errorCategorias" class="mt-3 text-sm text-red-500">{{ errorCategorias }}</p>
              </div>
            </div>

            <!-- Acción principal (postular - solo para estudiantes y ofertas activas) -->
            <div v-if="!esSupervisor && oferta.estado === 1"
              class="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
              <h2 class="text-lg font-bold text-[#1b2a4a] mb-1">¿Te interesa esta oferta?</h2>
              <p class="text-xs text-gray-400 mb-4">Postúlate directamente desde la plataforma.</p>

              <template v-if="sesion.rol === 'estudiante'">
                <button v-if="!yaPostulado"
                  class="w-full py-3 rounded-xl bg-[#1b2a4a] hover:bg-[#0f1a2e] text-white font-semibold transition disabled:opacity-50"
                  :disabled="postulando" @click="abrirModal">
                  {{ postulando ? 'Postulando...' : 'Postular ahora' }}
                </button>
                <div v-else
                  class="w-full py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold text-center text-sm">
                  ✓ Ya postulaste a esta oferta
                </div>
              </template>

              <template v-else>
                <button @click="irALogin"
                  class="w-full py-3 rounded-xl bg-[#1b2a4a] hover:bg-[#0f1a2e] text-white font-semibold transition">
                  Inicia sesión como estudiante para postular
                </button>
              </template>
            </div>

          </div>

          <!-- Sidebar -->
          <div class="w-full lg:w-72 flex-shrink-0">
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 class="text-lg font-bold text-[#1b2a4a] mb-4">Detalles de la oferta</h2>

              <button
                v-if="sesion.rol === 'estudiante'"
                @click="toggleFavorito"
                class="w-full mb-4 py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95"
                :class="favorito ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-400'"
              >
                <span :class="favorito ? 'drop-shadow-sm' : 'grayscale opacity-50'">
                  {{ favorito ? '❤️' : '🤍' }}
                </span>
                {{ favorito ? 'Guardado en favoritos' : 'Guardar en favoritos' }}
              </button>

              <ul class="flex flex-col gap-3">
                <li class="flex justify-between items-center text-sm">
                  <span class="text-gray-400">Estado:</span>
                  <span class="text-xs font-semibold px-3 py-1 rounded-full" :class="estiloEstado">
                    {{ textoEstado }}
                  </span>
                </li>
                <li class="flex justify-between items-center text-sm">
                  <span class="text-gray-400">Empresa:</span>
                  <span class="font-semibold text-gray-700">{{ nombreEmpresa }}</span>
                </li>
                <li class="flex justify-between items-center text-sm">
                  <span class="text-gray-400">Apertura:</span>
                  <span class="font-semibold text-gray-700">{{ formatearFechaCorta(oferta.fecha_apertura) }}</span>
                </li>
                <li v-if="oferta.fecha_cierre" class="flex justify-between items-center text-sm">
                  <span class="text-gray-400">Cierre:</span>
                  <span class="font-semibold text-gray-700">{{ formatearFechaCorta(oferta.fecha_cierre) }}</span>
                </li>
                <li v-if="oferta.modalidad" class="flex justify-between items-center text-sm">
                  <span class="text-gray-400">Modalidad:</span>
                  <span class="font-semibold text-gray-700">{{ oferta.modalidad }}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
        </div>
      </template>

    </div>

    <!-- Modal confirmar postulación -->
    <Transition name="fade">
      <div v-if="modalVisible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
        @click.self="cerrarModal">
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4">
          <h2 class="text-lg font-bold text-slate-800">Confirmar postulación</h2>
          <p class="text-sm text-slate-600">
            ¿Deseas postularte a <strong>{{ oferta?.oferta }}</strong>?
          </p>

          <p v-if="errorPostulacion" class="text-sm text-red-500">{{ errorPostulacion }}</p>

          <div class="flex gap-3 pt-2">
            <button
              class="flex-1 py-2.5 rounded-xl border border-gray-200 text-slate-600 hover:bg-slate-50 text-sm transition"
              @click="cerrarModal">
              Cancelar
            </button>
            <button
              class="flex-1 py-2.5 rounded-xl bg-[#1b2a4a] hover:bg-[#0f1a2e] text-white text-sm font-semibold transition disabled:opacity-50"
              :disabled="postulando" @click="confirmarPostulacion">
              {{ postulando ? 'Enviando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="mostrarModalConfirmarCategorias"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
        @click.self="mostrarModalConfirmarCategorias = false"
      >
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4">
          <h2 class="text-lg font-bold text-slate-800">Confirmar actualización de categorías</h2>
          <p class="text-sm text-slate-600">
            ¿Deseas aplicar los cambios realizados en las categorías de esta oferta?
          </p>

          <p v-if="errorCategorias" class="text-sm text-red-500">{{ errorCategorias }}</p>

          <div class="flex gap-3 pt-2">
            <button
              class="flex-1 py-2.5 rounded-xl border border-gray-200 text-slate-600 hover:bg-slate-50 text-sm transition"
              @click="mostrarModalConfirmarCategorias = false"
            >
              Cancelar
            </button>
            <button
              class="flex-1 py-2.5 rounded-xl bg-[#1b2a4a] hover:bg-[#0f1a2e] text-white text-sm font-semibold transition disabled:opacity-50"
              :disabled="guardandoCategorias"
              @click="guardarCategorias"
            >
              {{ guardandoCategorias ? 'Guardando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de rechazo para supervisor -->
    <RechazoOfertaModal :visible="mostrarModalRechazo" :nombre-oferta="oferta?.oferta || ''"
      @cancelar="cerrarModalRechazo" @confirmar="confirmarRechazo" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerOfertaPorId } from '@/services/ofertaService.js'
import { guardarFavorito, eliminarFavorito } from '@/services/OfertasFavoritos.js'
import { actualizarCategoriasOferta } from '@/services/categoriaService.js'
import { cambiarEstadoOferta } from '@/services/supervisorService.js'
import { obtenerEmpleadorPorId } from '@/services/empleadorService.js'
import { obtenerPostulaciones, postularAOferta } from '@/services/postulacionService.js'
import RechazoOfertaModal from '../components/misOfertas/RechazoOfertaModal.vue'
import CategoriaOfertaSelect from '@/components/publicarOferta/CategoriaOfertaSelect.vue'
import { obtenerOfertasFavoritas, agregarOfertaFavorita, deshabilitarOfertaFavorita } from '@/services/estudianteService.js'

const route = useRoute()
const router = useRouter()

const irAlPerfil = () => {
  if (oferta.value?.id_empleador) {
    router.push(`/empleador/${oferta.value.id_empleador}`)
  }
}

const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
const esSupervisor = computed(() => sesion.rol === 'supervisor')

const oferta = ref(null)
const empresaData = ref(null)
const cargando = ref(true)
const error = ref(null)
const modalVisible = ref(false)
const postulando = ref(false)
const yaPostulado = ref(false)
const errorPostulacion = ref(null)
const mostrarModalRechazo = ref(false)
const motivoRechazo = ref('')
const favorito = ref(false)
// TODO (integración): inicializar con esOfertaFavorita(sesion.id, route.params.id)
const toggleFavorito = async () => {
 favorito.value = !favorito.value;
  try {
    if (!favorito.value) {
      await deshabilitarOfertaFavorita(sesion.id, route.params.id);
    } else {
      await agregarOfertaFavorita(sesion.id, route.params.id);
    }
  } catch (err) {
    favorito.value = !favorito.value;
    console.error("Error al cambiar favorito:", err);
  }
}

const categoriaIds     = ref([])
const guardandoCategorias = ref(false)
const mostrarModalConfirmarCategorias = ref(false)
const errorCategorias  = ref('')

// Ruta de volver según rol
const rutaVolver = computed(() => {
  if (esSupervisor.value) {
    return '/dashboard-supervisor'
  }
  return '/ofertas'
})

const nombreEmpresa = computed(() =>
  empresaData.value?.empresa || `Empleador #${oferta.value?.id_empleador}`
)

const inicialEmpresa = computed(() =>
  (empresaData.value?.empresa || 'E')[0].toUpperCase()
)

const textoEstado = computed(() => {
  const map = { 0: 'Pendiente', 1: 'Activa', 2: 'Rechazada', 3: 'Archivada' }
  return map[oferta.value?.estado] ?? 'Desconocido'
})

const estiloEstado = computed(() => {
  const map = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100 text-green-700',
    2: 'bg-red-100 text-red-700',
    3: 'bg-gray-100 text-gray-500',
  }
  return map[oferta.value?.estado] ?? 'bg-gray-100 text-gray-500'
})

const formatearFecha = (fecha) => {
  if (!fecha) return 'No especificada'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const formatearFechaCorta = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toISOString().slice(0, 10)
}

const irALogin = () => router.push('/login')
const abrirModal = () => { modalVisible.value = true }
const cerrarModal = () => { modalVisible.value = false; errorPostulacion.value = null }

const confirmarPostulacion = async () => {
  postulando.value = true
  errorPostulacion.value = null
  try {
    await postularAOferta(sesion.id, route.params.id)
    yaPostulado.value = true
    cerrarModal()
  } catch (e) {
    errorPostulacion.value = e?.response?.data?.message ?? 'Error al postular. Intenta de nuevo.'
  } finally {
    postulando.value = false
  }
}

const guardarCategorias = async () => {
  if (!oferta.value) return
  errorCategorias.value = ''
  guardandoCategorias.value = true
  try {
    const response = await actualizarCategoriasOferta(oferta.value.id_oferta, categoriaIds.value.map((id) => Number(id)))
    if (response.success) {
      mostrarModalConfirmarCategorias.value = false
      await cargarOferta()
      alert('Categorías actualizadas correctamente')
    } else {
      errorCategorias.value = response.message || 'Error al actualizar categorías'
    }
  } catch (e) {
    console.error('Error al actualizar categorías:', e)
    errorCategorias.value = 'Error de conexión con el servidor'
  } finally {
    guardandoCategorias.value = false
  }
}

// Funciones para supervisor
const moderarOferta = async (estado) => {
  if (!oferta.value) return
  try {
    const response = await cambiarEstadoOferta(oferta.value.id_oferta, estado, null)
    if (response.success) {
      router.push('/dashboard-supervisor')
    } else {
      alert('Error al moderar la oferta: ' + (response.message || 'Intenta de nuevo'))
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión al moderar la oferta')
  }
}

const abrirModalRechazo = () => {
  motivoRechazo.value = ''
  mostrarModalRechazo.value = true
}

const cerrarModalRechazo = () => {
  mostrarModalRechazo.value = false
}

const confirmarRechazo = async (motivo) => {
  if (!oferta.value) return
  try {
    const response = await cambiarEstadoOferta(oferta.value.id_oferta, 2, motivo)
    if (response.success) {
      router.push('/dashboard-supervisor')
    } else {
      alert('Error al rechazar la oferta: ' + (response.message || 'Intenta de nuevo'))
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión al rechazar la oferta')
  }
}

const cargarOferta = async () => {
  try {
    const res = await obtenerOfertaPorId(route.params.id)
    if (!res.success) throw new Error('Oferta no encontrada')
    oferta.value = res.data
    categoriaIds.value = oferta.value.categorias ? oferta.value.categorias.map(c => String(c.id_categoria)) : []

    const [empRes] = await Promise.all([
      obtenerEmpleadorPorId(oferta.value.id_empleador),
      (async () => {
        if (sesion.id && sesion.rol === 'estudiante') {
          if (oferta.value.estado === 1) {
            const posRes = await obtenerPostulaciones(sesion.id)
            const lista = posRes.data ?? []
            yaPostulado.value = lista.some(
              p => String(p.id_oferta) === String(route.params.id)
            )
          }

          const favRes = await obtenerOfertasFavoritas(sesion.id)
          if(favRes.success && favRes.data) {
             favorito.value = favRes.data.some(o => String(o.id_oferta) === String(route.params.id));
          }
        }
      })()
    ])

    if (empRes.success) empresaData.value = empRes.data

  } catch (e) {
    console.error('[DetalleOferta]', e)
    error.value = 'No se pudo cargar la oferta. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await cargarOferta()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
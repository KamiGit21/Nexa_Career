<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Breadcrumb -->
    <header class="bg-slate-800 py-4 px-8">
      <div class="max-w-7xl mx-auto">
        <nav class="text-sm text-slate-400 flex items-center gap-2">
          <router-link to="/ofertas" class="hover:text-white transition">Catálogo de Ofertas</router-link>
          <span>/</span>
          <span class="text-white truncate">{{ oferta?.oferta ?? '...' }}</span>
        </nav>
      </div>
    </header>

    <!-- Cargando -->
    <div v-if="cargando" class="max-w-7xl mx-auto px-8 py-10 flex gap-8">
      <div class="flex-1 space-y-4">
        <div class="h-8 bg-slate-200 rounded animate-pulse w-2/3"/>
        <div class="h-4 bg-slate-200 rounded animate-pulse w-1/3"/>
        <div class="h-40 bg-slate-200 rounded-2xl animate-pulse mt-6"/>
      </div>
      <div class="w-80 shrink-0 h-64 bg-slate-200 rounded-2xl animate-pulse"/>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-8 py-20 text-center text-red-500">
      <p class="text-lg font-medium">{{ error }}</p>
      <button
        class="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition"
        @click="cargarDetalle"
      >
        Reintentar
      </button>
    </div>

    <!-- Contenido -->
    <div v-else-if="oferta" class="max-w-7xl mx-auto px-8 py-10 flex gap-8 items-start">

      <!-- Columna izquierda: detalle -->
      <article class="flex-1 space-y-8">

        <!-- Título y empresa -->
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-2xl">
            <!-- Logo: agregar cuando el servicio de empleador lo provea -->
            #{{ oferta.id_empleador }}
          </div>
          <div>
            <!-- Campo 'oferta' = título en la BD -->
            <h1 class="text-2xl font-bold text-slate-800">{{ oferta.oferta }}</h1>
            <p class="text-yellow-600 font-medium">Empleador #{{ oferta.id_empleador }}</p>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <span v-if="oferta.fecha_apertura" class="text-sm bg-slate-100 text-slate-600 rounded-md px-3 py-1">
            📅 Apertura: {{ oferta.fecha_apertura }}
          </span>
          <span class="text-sm bg-slate-100 text-slate-600 rounded-md px-3 py-1">
            Estado: {{ oferta.estado === 0 ? 'Pendiente' : 'Activa' }}
          </span>
        </div>

        <!-- Descripción -->
        <section v-if="oferta.descripcion">
          <h2 class="text-base font-semibold text-slate-700 mb-2">Descripción del puesto</h2>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="text-slate-600 text-sm leading-relaxed" v-html="oferta.descripcion"/>
        </section>

        <!-- Motivo de rechazo (solo si fue rechazada) -->
        <section v-if="oferta.rechazo">
          <h2 class="text-base font-semibold text-red-600 mb-2">Motivo de rechazo</h2>
          <p class="text-sm text-red-500">{{ oferta.rechazo }}</p>
        </section>

      </article>

      <!-- Columna derecha: acciones -->
      <aside class="w-80 shrink-0 sticky top-8">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

          <!-- Info rápida -->
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-slate-400 text-xs uppercase tracking-wide">ID Oferta</dt>
              <dd class="text-slate-800 font-medium">#{{ oferta.id_oferta }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 text-xs uppercase tracking-wide">Fecha apertura</dt>
              <dd class="text-slate-800 font-medium">{{ oferta.fecha_apertura ?? 'No especificada' }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 text-xs uppercase tracking-wide">Estado</dt>
              <dd class="text-slate-800 font-medium">{{ oferta.estado === 0 ? 'Pendiente' : 'Activa' }}</dd>
            </div>
          </dl>

          <!-- Botón postular (solo si hay sesión de estudiante) -->
          <template v-if="sesion.rol === 'estudiante'">
            <button
              v-if="!yaPostulado"
              class="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition disabled:opacity-50"
              :disabled="postulando"
              @click="abrirModal"
            >
              {{ postulando ? 'Postulando...' : 'Postular ahora' }}
            </button>
            <div
              v-else
              class="w-full py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold text-center text-sm"
            >
              ✓ Ya postulaste a esta oferta
            </div>
          </template>

          <!-- Volver -->
          <router-link
            to="/ofertas"
            class="block text-center text-sm text-slate-400 hover:text-slate-600 transition"
          >
            ← Volver al catálogo
          </router-link>
        </div>
      </aside>
    </div>

    <!-- Modal confirmar postulación -->
    <Transition name="fade">
      <div
        v-if="modalVisible"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
        @click.self="cerrarModal"
      >
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4">
          <h2 class="text-lg font-bold text-slate-800">Confirmar postulación</h2>
          <p class="text-sm text-slate-600">
            ¿Deseas postularte a <strong>{{ oferta?.oferta }}</strong>?
          </p>

          <p v-if="errorPostulacion" class="text-sm text-red-500">{{ errorPostulacion }}</p>

          <div class="flex gap-3 pt-2">
            <button
              class="flex-1 py-2.5 rounded-xl border border-gray-200 text-slate-600 hover:bg-slate-50 text-sm transition"
              @click="cerrarModal"
            >
              Cancelar
            </button>
            <button
              class="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition disabled:opacity-50"
              :disabled="postulando"
              @click="confirmarPostulacion"
            >
              {{ postulando ? 'Enviando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { obtenerOfertaPorId } from '@/services/ofertaService.js'
import { obtenerPostulaciones, postularAOferta } from '@/services/postulacionService.js'

const route = useRoute()

// Sesión del usuario 
const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')

const oferta           = ref(null)
const cargando         = ref(false)
const error            = ref(null)
const modalVisible     = ref(false)
const postulando       = ref(false)
const yaPostulado      = ref(false)
const errorPostulacion = ref(null)

async function cargarDetalle() {
  cargando.value = true
  error.value    = null
  try {
    const res = await obtenerOfertaPorId(route.params.id)
    oferta.value = res.data
  } catch (e) {
    error.value = 'No se pudo cargar la oferta.'
    console.error('[DetalleOferta] cargarDetalle:', e)
  } finally {
    cargando.value = false
  }
}

async function verificarPostulacion() {
  if (!sesion.id || sesion.rol !== 'estudiante') return
  try {
    const res = await obtenerPostulaciones(sesion.id)
    const postulaciones = res.data ?? []
    yaPostulado.value = postulaciones.some(
      p => String(p.id_oferta) === String(route.params.id)
    )
  } catch (e) {
    console.error('[DetalleOferta] verificarPostulacion:', e)
  }
}

async function confirmarPostulacion() {
  postulando.value       = true
  errorPostulacion.value = null
  try {
    await postularAOferta(sesion.id, route.params.id)
    yaPostulado.value = true
    cerrarModal()
  } catch (e) {
    errorPostulacion.value = e?.response?.data?.message ?? 'Error al postular. Intenta de nuevo.'
    console.error('[DetalleOferta] confirmarPostulacion:', e)
  } finally {
    postulando.value = false
  }
}

function abrirModal()  { modalVisible.value = true }
function cerrarModal() { modalVisible.value = false; errorPostulacion.value = null }

onMounted(() => {
  cargarDetalle()
  verificarPostulacion()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }
</style>
<template>
  <div class="moderar-item-wrapper">
    <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-bold text-[#1b2a4a] text-lg leading-tight">{{ item.titulo }}</h3>
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
          Pendiente
        </span>
      </div>

      <p class="text-sm text-gray-500 line-clamp-2 mb-4">
        {{ item.descripcion || 'Sin descripción' }}
      </p>

      <div class="flex items-center justify-between text-xs text-gray-400 mb-5">
        <span>📅 {{ formatearFecha(item.fecha) }}</span>
        <span class="capitalize">👤 {{ item.tipo }} · {{ item.publicador }}</span>
      </div>

      <div class="flex gap-2 flex-wrap">
        <button @click="abrirModal(1)" :disabled="cargando"
          class="flex-1 py-2 px-3 bg-green-600 text-white text-[10px] sm:text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
          ✓ Aceptar
        </button>
        <button @click="abrirModal(2)" :disabled="cargando"
          class="flex-1 py-2 px-3 bg-red-500 text-white text-[10px] sm:text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50">
          ✗ Rechazar
        </button>
        <button @click="abrirModal(3)" :disabled="cargando"
          class="flex-1 py-2 px-3 bg-gray-400 text-white text-[10px] sm:text-xs font-semibold rounded-xl hover:bg-gray-500 transition-colors disabled:opacity-50">
          Archivar
        </button>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="mostrarModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
        @click.self="cerrarModal">
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">

          <button @click="cerrarModal"
            class="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-90"
            title="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl" :class="config.iconoBg">
            {{ config.icono }}
          </div>

          <div>
            <h2 class="text-xl font-bold text-[#1b2a4a]">{{ config.titulo }}</h2>
            <p class="text-sm text-gray-500 mt-1">
              ¿Confirmas esta acción sobre
              <span class="font-semibold text-slate-700">"{{ item.titulo }}"</span>?
            </p>
          </div>

          <div v-if="estadoSeleccionado === 2" class="text-left">
            <label class="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Motivo del rechazo</label>
            <input v-model="motivoRechazo" type="text" placeholder="Ej. Información insuficiente..."
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all" />
          </div>

          <div class="flex gap-3 pt-1">
            <button @click="cerrarModal"
              class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button @click="confirmarAccion" :disabled="estadoSeleccionado === 2 && !motivoRechazo.trim()"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="config.btnConfirmar">
              Confirmar
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  cargando: { type: Boolean, default: false }
})

const emit = defineEmits(['accion'])

const mostrarModal = ref(false)
const estadoSeleccionado = ref(null)
const motivoRechazo = ref('')

const ESTADOS = {
  1: { label: 'Aceptar', titulo: '¿Aceptar contenido?', icono: '✅', iconoBg: 'bg-green-100', badge: 'bg-green-100 text-green-700', btnConfirmar: 'bg-green-600 hover:bg-green-700' },
  2: { label: 'Rechazar', titulo: '¿Rechazar contenido?', icono: '❌', iconoBg: 'bg-red-100', badge: 'bg-red-100 text-red-700', btnConfirmar: 'bg-red-500 hover:bg-red-600' },
  3: { label: 'Archivar', titulo: '¿Archivar contenido?', icono: '📦', iconoBg: 'bg-gray-100', badge: 'bg-gray-100 text-gray-600', btnConfirmar: 'bg-gray-500 hover:bg-gray-600' },
}

const config = computed(() => ESTADOS[estadoSeleccionado.value] ?? {})

const abrirModal = (estado) => {
  estadoSeleccionado.value = estado
  motivoRechazo.value = ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const confirmarAccion = () => {
  // Validación de seguridad antes de emitir
  if (estadoSeleccionado.value === 2 && !motivoRechazo.value.trim()) return

  emit('accion', {
    id: props.item.id,
    estado: estadoSeleccionado.value,
    rechazo: motivoRechazo.value,
  })
  cerrarModal()
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>

<style scoped>
/* Transición suave para el modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Efecto para truncar texto */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
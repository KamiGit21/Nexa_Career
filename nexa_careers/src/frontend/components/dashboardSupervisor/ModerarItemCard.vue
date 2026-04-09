<template>
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

    <!-- Botones -->
    <div class="flex gap-2 flex-wrap">
      <button
        @click="abrirModal(1)"
        :disabled="cargando"
        class="flex-1 py-2 px-3 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        ✓ Aceptar
      </button>
      <button
        @click="abrirModal(2)"
        :disabled="cargando"
        class="flex-1 py-2 px-3 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        ✗ Rechazar
      </button>
      <button
        @click="abrirModal(3)"
        :disabled="cargando"
        class="flex-1 py-2 px-3 bg-gray-400 text-white text-xs font-semibold rounded-xl hover:bg-gray-500 transition-colors disabled:opacity-50"
      >
        Archivar
      </button>
    </div>
  </div>

  <!-- Modal de confirmación -->
  <Transition name="modal-fade">
    <div
      v-if="mostrarModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="cerrarModal"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">

        <!-- Icono -->
        <div
          class="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          :class="config.iconoBg"
        >
          {{ config.icono }}
        </div>

        <!-- Textos -->
        <div>
          <h2 class="text-xl font-bold text-[#1b2a4a]">{{ config.titulo }}</h2>
          <p class="text-sm text-gray-500 mt-1">
            ¿Confirmas esta acción sobre
            <span class="font-semibold text-slate-700">"{{ item.titulo }}"</span>?
          </p>
        </div>

        <!-- Badge de estado -->
        <span
          class="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
          :class="config.badge"
        >
          {{ config.label }}
        </span>

        <!-- Input motivo rechazo -->
        <div v-if="estadoSeleccionado === 2">
          <input
            v-model="motivoRechazo"
            type="text"
            placeholder="Escribe el motivo del rechazo..."
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 text-left"
          />
        </div>

        <!-- Botones -->
        <div class="flex gap-3 pt-1">
          <button
            @click="cerrarModal"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmarAccion"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            :class="config.btnConfirmar"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item:     { type: Object,  required: true },
  cargando: { type: Boolean, default: false }
})

const emit = defineEmits(['accion'])

const mostrarModal       = ref(false)
const estadoSeleccionado = ref(null)
const motivoRechazo      = ref('')

const ESTADOS = {
  1: { label: 'Aceptar',  titulo: '¿Aceptar esta oferta?',  icono: '✅', iconoBg: 'bg-green-100', badge: 'bg-green-100 text-green-700', btnConfirmar: 'bg-green-600 hover:bg-green-700' },
  2: { label: 'Rechazar', titulo: '¿Rechazar esta oferta?', icono: '❌', iconoBg: 'bg-red-100',   badge: 'bg-red-100 text-red-700',     btnConfirmar: 'bg-red-500 hover:bg-red-600'     },
  3: { label: 'Archivar', titulo: '¿Archivar esta oferta?', icono: '📦', iconoBg: 'bg-gray-100',  badge: 'bg-gray-100 text-gray-600',   btnConfirmar: 'bg-gray-500 hover:bg-gray-600'   },
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
  emit('accion', {
    id:      props.item.id,
    estado:  estadoSeleccionado.value,
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
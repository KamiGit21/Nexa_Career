<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      @click.self="$emit('cancelar')"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">
        <div class="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
          ❌
        </div>

        <div>
          <h2 class="text-xl font-bold text-[#1b2a4a]">Rechazar oferta</h2>
          <p class="text-sm text-gray-500 mt-1">
            Ingresa el motivo del rechazo para <span class="font-semibold">"{{ nombreOferta }}"</span>
          </p>
        </div>

        <div class="text-left space-y-1">
          <input
            v-model="motivo"
            type="text"
            placeholder="Ej. Información incompleta, requisitos poco claros..."
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                   focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
          />
          <p v-if="mostrarError" class="text-xs text-red-500">El motivo es obligatorio.</p>
        </div>

        <div class="flex gap-3 pt-1">
          <button
            @click="$emit('cancelar')"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                   text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmar"
            class="flex-1 py-2.5 bg-red-500 rounded-xl text-sm font-semibold
                   text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible:      { type: Boolean, default: false },
  nombreOferta: { type: String,  default: ''    },
})

const emit = defineEmits(['cancelar', 'confirmar'])

const motivo       = ref('')
const mostrarError = ref(false)

watch(() => props.visible, (val) => {
  if (!val) { motivo.value = ''; mostrarError.value = false }
})

const confirmar = () => {
  if (!motivo.value.trim()) { mostrarError.value = true; return }
  emit('confirmar', motivo.value.trim())
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
</style>
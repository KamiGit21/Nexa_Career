<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="$emit('cancelar')"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">

        <div class="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <span class="text-red-600 text-2xl font-bold">!</span>
        </div>

        <h2 class="text-xl font-bold text-[#1b2a4a]">¿Dar de baja esta oferta?</h2>

        <div class="space-y-1">
          <p class="text-sm text-gray-600">
            <span class="font-semibold">"{{ nombreOferta }}"</span>
            dejará de ser visible para los estudiantes.
          </p>
          <p class="text-xs text-gray-400">La oferta pasará a estado <strong>Inactiva</strong>.</p>
        </div>

        <p v-if="error" class="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
          {{ error }}
        </p>

        <div class="flex gap-3 pt-2">
          <button
            @click="$emit('cancelar')"
            :disabled="cargando"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                   text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirmar')"
            :disabled="cargando"
            class="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold
                   hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ cargando ? 'Procesando...' : 'Sí, dar de baja' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible:      { type: Boolean, default: false },
  nombreOferta: { type: String,  default: ''    },
  cargando:     { type: Boolean, default: false },
  error:        { type: String,  default: ''    },
})

defineEmits(['cancelar', 'confirmar'])
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
</style>
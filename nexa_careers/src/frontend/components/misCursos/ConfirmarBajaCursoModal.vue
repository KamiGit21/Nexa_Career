<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="$emit('cancelar')"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">

        <!-- Ícono de advertencia -->
        <div class="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <span class="text-red-600 text-2xl font-bold">!</span>
        </div>

        <!-- Título -->
        <h2 class="text-xl font-bold text-[#1b2a4a]">¿Dar de baja este curso?</h2>

        <!-- Descripción -->
        <div class="space-y-1">
          <p class="text-sm text-[#64748b]">
            <span class="font-semibold text-slate-700">"{{ nombreCurso }}"</span>
            dejará de ser visible para otros usuarios.
          </p>
          <p class="text-xs text-[#64748b]">Esta acción no se puede deshacer.</p>
        </div>

        <!-- Botones -->
        <div class="flex gap-3 pt-2">
          <button
            @click="$emit('cancelar')"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirmar')"
            :disabled="cargando"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
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
  visible:     { type: Boolean, default: false },
  nombreCurso: { type: String,  default: '' },
  cargando:    { type: Boolean, default: false },
})

defineEmits(['cancelar', 'confirmar'])
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
</style>
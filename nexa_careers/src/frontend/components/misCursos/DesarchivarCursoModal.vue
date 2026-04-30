<!-- src/frontend/components/misCursos/DesarchivarCursoModal.vue -->
<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="$emit('cancelar')"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">

        <!-- Ícono -->
        <div class="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <span class="text-green-600 text-2xl">♻️</span>
        </div>

        <!-- Título -->
        <h2 class="text-xl font-bold text-[#1b2a4a]">¿Desarchivar este curso?</h2>

        <!-- Descripción -->
        <div class="space-y-1">
          <p class="text-sm text-[#64748b]">
            <span class="font-semibold text-slate-700">"{{ nombreCurso }}"</span>
            volverá a estado <span class="font-semibold text-yellow-600">Pendiente</span> y deberá ser revisado nuevamente.
          </p>
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
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {{ cargando ? 'Procesando...' : 'Sí, desarchivar' }}
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
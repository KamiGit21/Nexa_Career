<template>
  <Transition name="fade">
    <div
      v-if="categoria"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      @click.self="$emit('cancelar')"
    >
      <div class="bg-white rounded-2xl shadow-xl p-7 w-full max-w-sm text-center space-y-4">
        <p class="text-2xl">🗑️</p>
        <h3 class="text-base font-bold text-slate-800">
          ¿Eliminar "{{ categoria.categoria }}"?
        </h3>
        <p class="text-xs text-slate-500">Esta acción no se puede deshacer.</p>
        <div class="flex gap-3 pt-1">
          <button
            @click="$emit('cancelar')"
            class="flex-1 py-2 border border-gray-200 rounded-xl text-sm
                   text-slate-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirmar')"
            class="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm
                   font-semibold hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({ categoria: { type: Object, default: null } })
defineEmits(['cancelar', 'confirmar'])
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
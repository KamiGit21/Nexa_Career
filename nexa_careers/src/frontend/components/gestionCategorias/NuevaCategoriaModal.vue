<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      @click.self="$emit('cerrar')"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-bold text-slate-700">Agregar nueva categoría</h2>
          <button @click="$emit('cerrar')" class="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        <label class="block text-xs font-semibold text-gray-600 mb-1">
          Nombre <span class="text-red-500">*</span>
        </label>
        <input
          v-model="nombre"
          type="text"
          maxlength="80"
          placeholder="Ej. Logística, Salud..."
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                 focus:outline-none focus:border-[#1e293b] transition-colors mb-4"
        />

        <div class="mb-4">
          <p class="text-xs font-semibold text-gray-600 mb-1">Vista previa</p>
          <div class="border border-dashed border-gray-200 rounded-xl px-4 py-3 min-h-[44px] flex items-center">
            <span
              v-if="nombre.trim()"
              class="px-3 py-1 bg-[#1e293b] text-white text-xs rounded-full font-semibold"
            >
              {{ nombre.trim() }}
            </span>
            <span v-else class="text-xs text-slate-400">El badge aparecerá aquí</span>
          </div>
        </div>

        <p class="text-xs text-blue-600 mb-4">
          Las categorías creadas estarán disponibles de inmediato.
        </p>

        <div class="flex gap-3">
          <button
            @click="$emit('cerrar')"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-600
                   hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="guardar"
            :disabled="!nombre.trim() || guardando"
            class="flex-1 py-2.5 bg-[#1e293b] text-white text-sm font-semibold rounded-xl
                   hover:bg-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {{ guardando ? 'Guardando...' : 'Guardar categoría' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  visible:  { type: Boolean, default: false },
  guardando: { type: Boolean, default: false },
})

const emit  = defineEmits(['cerrar', 'guardada'])
const nombre = ref('')

const guardar = () => {
  if (!nombre.value.trim()) return
  emit('guardada', nombre.value.trim())
  nombre.value = ''
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
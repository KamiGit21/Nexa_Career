<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      @click.self="cerrar"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-bold text-slate-700">Editar categoría</h2>
          <button @click="cerrar" class="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        <label class="block text-xs font-semibold text-gray-600 mb-1">
          Nuevo nombre <span class="text-red-500">*</span>
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

        <!-- Modal de confirmación interna -->
        <div v-if="confirming" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          ¿Confirmas guardar el cambio de nombre?
        </div>

        <div class="flex gap-3">
          <button
            @click="cerrar"
            class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            v-if="!confirming"
            @click="confirming = true"
            :disabled="!nombre.trim() || nombre.trim() === categoria?.categoria"
            class="flex-1 py-2.5 bg-[#1e293b] text-white text-sm font-semibold rounded-xl
                   hover:bg-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Guardar cambios
          </button>
          <button
            v-else
            @click="confirmar"
            :disabled="guardando"
            class="flex-1 py-2.5 bg-[#1e293b] text-white text-sm font-semibold rounded-xl
                   hover:bg-[#0f172a] disabled:opacity-40 transition-colors"
          >
            {{ guardando ? 'Guardando...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible:   { type: Boolean, default: false },
  categoria: { type: Object, default: null },
  guardando: { type: Boolean, default: false }
})
const emit = defineEmits(['cerrar', 'guardada'])

const nombre     = ref('')
const confirming = ref(false)

watch(() => props.categoria, (val) => { nombre.value = val?.categoria ?? '' })
watch(() => props.visible,   (val) => { if (!val) { confirming.value = false } })

const cerrar    = () => { confirming.value = false; emit('cerrar') }
const confirmar = () => {
  if (!nombre.value.trim()) return
  emit('guardada', { id: props.categoria.id_categoria, nombre: nombre.value.trim() })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
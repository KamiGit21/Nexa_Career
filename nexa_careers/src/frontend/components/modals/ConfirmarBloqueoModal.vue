<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="cerrar">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
      <div class="text-center">
        <div class="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Bloquear {{ tipoUsuario }}</h3>
        <p class="text-sm text-gray-500 mb-4">
          ¿Estás seguro de que deseas bloquear a <strong>{{ nombreUsuario }}</strong>?
        </p>
        <p class="text-xs text-red-500 mb-4">
          Esta acción desactivará la cuenta del usuario y no podrá acceder al sistema.
        </p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 text-left mb-1">Motivo del bloqueo (opcional)</label>
          <textarea
            v-model="motivo"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            placeholder="Ej: Publicación inapropiada, violación de normas..."
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="cerrar"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            @click="confirmar"
            :disabled="bloqueando"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {{ bloqueando ? 'Bloqueando...' : 'Bloquear' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  tipoUsuario: { type: String, default: 'usuario' },
  nombreUsuario: { type: String, default: '' },
  idUsuario: { type: [Number, String], default: null }
})

const emit = defineEmits(['cerrar', 'confirmar'])

const motivo = ref('')
const bloqueando = ref(false)

const cerrar = () => {
  motivo.value = ''
  emit('cerrar')
}

const confirmar = async () => {
  bloqueando.value = true
  await emit('confirmar', { id: props.idUsuario, motivo: motivo.value })
  bloqueando.value = false
  cerrar()
}

watch(() => props.visible, (val) => {
  if (!val) {
    motivo.value = ''
  }
})
</script>
<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="cerrar">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
      <div class="text-center">
        <div class="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Dar de baja curso</h3>
        <p class="text-sm text-gray-500 mb-2">
          ¿Estás seguro de que deseas dar de baja este curso?
        </p>
        <p class="text-sm font-medium text-gray-700 mb-3">
          <strong>{{ curso?.curso || 'Curso' }}</strong>
        </p>
        <p class="text-xs text-red-500 mb-4">
          Esta acción cambiará el estado del curso a "Archivado" (estado 3) y ya no será visible para los estudiantes.
        </p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 text-left mb-1">Motivo de la baja (obligatorio)</label>
          <textarea
            v-model="motivo"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            placeholder="Ej: Contenido inapropiado, información falsa, violación de normas de la plataforma..."
          ></textarea>
          <p v-if="errorMotivo" class="text-xs text-red-500 mt-1">El motivo es obligatorio</p>
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
            :disabled="dandoDeBaja"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {{ dandoDeBaja ? 'Procesando...' : 'Dar de baja' }}
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
  curso: { type: Object, default: null }
})

const emit = defineEmits(['cerrar', 'confirmar'])

const motivo = ref('')
const dandoDeBaja = ref(false)
const errorMotivo = ref(false)

const cerrar = () => {
  motivo.value = ''
  errorMotivo.value = false
  emit('cerrar')
}

const confirmar = async () => {
  if (!motivo.value.trim()) {
    errorMotivo.value = true
    return
  }
  errorMotivo.value = false
  dandoDeBaja.value = true
  
  // Simular un pequeño retraso (como si fuera una llamada a la API)
  setTimeout(() => {
    emit('confirmar', { 
      idCurso: props.curso?.id_curso, 
      motivo: motivo.value 
    })
    dandoDeBaja.value = false
    cerrar()
  }, 500)
}

watch(() => props.visible, (val) => {
  if (!val) {
    motivo.value = ''
    errorMotivo.value = false
  }
})
</script>
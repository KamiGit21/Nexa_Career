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
        @click="$emit('accion', { id: item.id, estado: 1 })"
        :disabled="cargando"
        class="flex-1 py-2 px-3 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        ✓ Aceptar
      </button>
      <button
        @click="solicitarRechazo"
        :disabled="cargando"
        class="flex-1 py-2 px-3 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        ✗ Rechazar
      </button>
      <button
        @click="$emit('accion', { id: item.id, estado: 3 })"
        :disabled="cargando"
        class="flex-1 py-2 px-3 bg-gray-400 text-white text-xs font-semibold rounded-xl hover:bg-gray-500 transition-colors disabled:opacity-50"
      >
        Archivar
      </button>
    </div>

    <!-- Motivo rechazo -->
    <div v-if="mostrarMotivo" class="mt-3 flex gap-2">
      <input
        v-model="motivoRechazo"
        type="text"
        placeholder="Motivo del rechazo..."
        class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-400"
      />
      <button
        @click="confirmarRechazo"
        class="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors"
      >
        Confirmar
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item:     { type: Object,  required: true },
  cargando: { type: Boolean, default: false }
})

const emit = defineEmits(['accion'])

const mostrarMotivo = ref(false)
const motivoRechazo = ref('')

const solicitarRechazo = () => {
  mostrarMotivo.value = true
  motivoRechazo.value = ''
}

const confirmarRechazo = () => {
  emit('accion', { id: props.item.id, estado: 2, rechazo: motivoRechazo.value })
  mostrarMotivo.value = false
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>
<template>
  <div class="flex gap-3 w-full">
    <button
      @click="$emit('cancelar')"
      :disabled="cargando"
      class="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
    >
      Cancelar
    </button>
    <button
      @click="$emit('confirmar')"
      :disabled="cargando"
      class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      {{ cargando ? 'Desbloqueando...' : 'Confirmar' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  cargando: { type: Boolean, default: false }
})
defineEmits(['cancelar', 'confirmar'])
</script>
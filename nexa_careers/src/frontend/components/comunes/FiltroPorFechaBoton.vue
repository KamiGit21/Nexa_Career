<template>
  <button
    @click="$emit('click')"
    :class="[
      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors',
      activo
        ? 'bg-[#1b2a4a] text-white border-[#1b2a4a]'
        : 'bg-white text-gray-600 border-gray-300 hover:border-[#1b2a4a] hover:text-[#1b2a4a]'
    ]"
  >
    📅 {{ etiqueta }}
    <span class="text-xs">{{ abierto ? '▲' : '▼' }}</span>
  </button>
</template>

<script setup>
defineProps({
  etiqueta: { type: String, default: 'Fecha' },
  activo:   { type: Boolean, default: false },
  abierto:  { type: Boolean, default: false }
})
defineEmits(['click'])
</script>
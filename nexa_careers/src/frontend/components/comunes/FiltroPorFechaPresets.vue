<template>
  <div class="flex flex-col gap-1">
    <button
      v-for="opcion in opciones"
      :key="opcion.valor"
      @click="$emit('seleccionar', opcion.valor)"
      :class="[
        'w-full text-left px-3 py-2 rounded-xl text-sm transition-colors',
        seleccionado === opcion.valor
          ? 'bg-[#1b2a4a] text-white'
          : 'hover:bg-gray-100 text-gray-700'
      ]"
    >
      {{ opcion.etiqueta }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  seleccionado: { type: String, default: '' }
})
defineEmits(['seleccionar'])

const opciones = [
  { valor: 'dia',    etiqueta: 'Último día' },
  { valor: 'semana', etiqueta: 'Última semana' },
  { valor: 'mes',    etiqueta: 'Último mes' }
]
</script>
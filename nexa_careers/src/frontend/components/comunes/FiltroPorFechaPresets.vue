<template>
  <div class="flex flex-col gap-1">
    <button
      v-for="opcion in opcionesActivas"
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
import { computed } from 'vue'

const props = defineProps({
  seleccionado: { type: String, default: '' },
  opciones:     { type: Array,  default: null }
})
defineEmits(['seleccionar'])

const defaultOpciones = [
  { valor: 'dia',    etiqueta: 'Último día' },
  { valor: 'semana', etiqueta: 'Última semana' },
  { valor: 'mes',    etiqueta: 'Último mes' }
]

const opcionesActivas = computed(() => props.opciones ?? defaultOpciones)
</script>
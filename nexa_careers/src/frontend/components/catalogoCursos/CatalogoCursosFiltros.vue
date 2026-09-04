<template>
  <div class="flex flex-wrap gap-4 mb-8 items-center justify-between px-6 max-w-7xl mx-auto">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cat in categorias"
        :key="cat"
        @click="$emit('update:categoriaActiva', cat)"
        :class="[
          'px-5 py-2 rounded-full text-xs font-bold transition-all border active:scale-95',
          categoriaActiva === cat
            ? 'bg-[#1b2a4a] text-[#d0b06d] border-[#1b2a4a] shadow-md'
            : 'bg-white border-gray-200 text-gray-500 hover:border-[#1b2a4a] hover:text-[#1b2a4a]'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <FiltroPorFecha
      :model-value="rangoFecha"
      :presets-opciones="presetsCursos"
      @update:model-value="$emit('update:rangoFecha', $event)"
    />
  </div>
</template>

<script setup>
import FiltroPorFecha from '../comunes/FiltroPorFecha.vue'

defineProps({
  categoriaActiva: { type: String, required: true },
  orden:           { type: String, required: true },
  categorias:      { type: Array,  required: true },
  rangoFecha:      { type: Object, default: () => ({ preset: '', desde: '', hasta: '' }) }
})
defineEmits(['update:categoriaActiva', 'update:orden', 'update:rangoFecha'])

const presetsCursos = [
  { valor: 'dia',    etiqueta: 'Publicados hoy' },
  { valor: 'semana', etiqueta: 'Última semana' },
  { valor: 'mes',    etiqueta: 'Último mes' }
]
</script>
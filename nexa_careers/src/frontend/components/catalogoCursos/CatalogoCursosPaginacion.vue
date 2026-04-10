<template>
  <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-1.5 mt-12 select-none">

    <!-- Botón Anterior -->
    <button
      @click="$emit('cambiar', paginaActual - 1)"
      :disabled="paginaActual === 1"
      class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
             border border-gray-200 bg-white text-gray-600
             hover:border-[#1b2a4a] hover:text-[#1b2a4a] hover:shadow-sm
             disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:hover:shadow-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="hidden sm:inline">Anterior</span>
    </button>

    <template v-if="paginasVisibles[0] > 1">
      <button
        @click="$emit('cambiar', 1)"
        class="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200
               border border-gray-200 bg-white text-gray-600
               hover:border-[#1b2a4a] hover:text-[#1b2a4a] hover:shadow-sm"
      >1</button>
      <span v-if="paginasVisibles[0] > 2" class="text-gray-400 text-sm px-1">···</span>
    </template>

    <!-- Páginas visibles -->
    <button
      v-for="pagina in paginasVisibles"
      :key="pagina"
      @click="$emit('cambiar', pagina)"
      class="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200"
      :class="pagina === paginaActual
        ? 'bg-[#1b2a4a] text-[#d0b06d] border border-[#1b2a4a] shadow-md scale-105'
        : 'border border-gray-200 bg-white text-gray-600 hover:border-[#1b2a4a] hover:text-[#1b2a4a] hover:shadow-sm'"
    >
      {{ pagina }}
    </button>

    <template v-if="paginasVisibles[paginasVisibles.length - 1] < totalPaginas">
      <span v-if="paginasVisibles[paginasVisibles.length - 1] < totalPaginas - 1" class="text-gray-400 text-sm px-1">···</span>
      <button
        @click="$emit('cambiar', totalPaginas)"
        class="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200
               border border-gray-200 bg-white text-gray-600
               hover:border-[#1b2a4a] hover:text-[#1b2a4a] hover:shadow-sm"
      >{{ totalPaginas }}</button>
    </template>

    <!-- Botón Siguiente -->
    <button
      @click="$emit('cambiar', paginaActual + 1)"
      :disabled="paginaActual === totalPaginas"
      class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
             border border-gray-200 bg-white text-gray-600
             hover:border-[#1b2a4a] hover:text-[#1b2a4a] hover:shadow-sm
             disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:hover:shadow-none"
    >
      <span class="hidden sm:inline">Siguiente</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Contador -->
    <span class="hidden lg:block ml-3 text-xs text-gray-400 font-medium">
      Página {{ paginaActual }} de {{ totalPaginas }}
    </span>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  paginaActual: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
})

defineEmits(['cambiar'])

const paginasVisibles = computed(() => {
  const ventana = 5
  let inicio = Math.max(1, props.paginaActual - Math.floor(ventana / 2))
  let fin    = Math.min(props.totalPaginas, inicio + ventana - 1)

  if (fin - inicio < ventana - 1) {
    inicio = Math.max(1, fin - ventana + 1)
  }

  const paginas = []
  for (let i = inicio; i <= fin; i++) paginas.push(i)
  return paginas
})
</script>
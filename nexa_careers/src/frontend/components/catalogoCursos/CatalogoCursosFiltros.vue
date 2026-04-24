<template>
  <div class="flex flex-col gap-6 mb-10">
    <div class="flex flex-col md:flex-row gap-4 items-center">
      
      <div class="relative flex-1 w-full group">
        <div 
          class="absolute left-3.5 flex items-center pointer-events-none z-10"
          style="top: 40%; transform: translateY(-50%);"
        >
        <span>🔎</span>
        </div>

        <input
          :value="busqueda"
          @input="$emit('update:busqueda', $event.target.value)"
          type="text"
          placeholder="¿Qué quieres aprender hoy?"
          style="padding-left: 3.2rem !important;"
          class="w-full pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-[#1b2a4a]/5 focus:border-[#1b2a4a] outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      <!--<div class="w-full md:w-auto">
        <select
          :value="orden"
          @change="$emit('update:orden', $event.target.value)"
          class="w-full border border-gray-200 rounded-2xl text-sm font-semibold px-4 py-3.5 text-[#1b2a4a] bg-white focus:ring-4 focus:ring-[#1b2a4a]/5 focus:border-[#1b2a4a] outline-none transition-all cursor-pointer appearance-none shadow-sm"
          style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%231b2a4a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; padding-right: 3rem;"
        >
          <option value="reciente">Más recientes</option>
          <option value="antiguo">Más antiguos</option>
          <option value="titulo">Orden alfabético (A-Z)</option>
        </select>
      </div>
      -->
    </div>

    <div class="flex items-center gap-3">
      <span class="text-[10px] uppercase tracking-widest font-bold text-gray-400 hidden sm:block">Categorías:</span>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categorias"
          :key="cat"
          @click="$emit('update:categoriaActiva', cat)"
          :class="[
            'px-5 py-2 rounded-full text-xs font-bold transition-all border active:scale-95',
            categoriaActiva === cat
              ? 'bg-[#1b2a4a] text-[#d0b06d] border-[#1b2a4a] shadow-lg shadow-[#1b2a4a]/20'
              : 'bg-white border-gray-200 text-gray-500 hover:border-[#1b2a4a] hover:text-[#1b2a4a]'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  busqueda:        { type: String,  required: true },
  categoriaActiva: { type: String,  required: true },
  orden:           { type: String,  required: true },
  categorias:      { type: Array,   required: true },
})

defineEmits(['update:busqueda', 'update:categoriaActiva', 'update:orden'])
</script>
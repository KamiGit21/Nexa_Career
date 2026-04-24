<template>
  <header class="bg-[#1b2a4a] text-white py-16 px-8 text-center rounded-b-[3rem] mb-10 shadow-xl">
    <h1 class="text-4xl font-extrabold mb-4">Potencia tus habilidades</h1>
    <p class="text-[#d0b06d] max-w-2xl mx-auto mb-8 font-medium">
      Cursos creados por la comunidad Nexa para impulsar tu carrera.
    </p>
    
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-stretch justify-center">
      <div class="flex-1 bg-white p-1.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-4 focus-within:ring-[#d0b06d]/30">
        <div class="flex-1 flex items-center px-4 gap-3">
          <span class="text-gray-400">🔍</span>
          <input 
            :value="busqueda" 
            @input="$emit('update:busqueda', $event.target.value)"
            @keyup.enter="$emit('buscar')"
            type="text" 
            placeholder="¿Qué quieres aprender hoy?"
            class="w-full py-3 text-slate-800 outline-none text-base font-medium bg-transparent border-none focus:ring-0"
          />
        </div>
        <button 
          @click="$emit('buscar')"
          class="bg-[#1b2a4a] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#253b66] active:scale-95 transition-all shadow-lg"
        >
          Buscar
        </button>
      </div>

      <button 
        @click="$emit('toggle-orden')"
        :class="orden === 'reciente' ? 'bg-[#d0b06d] text-[#1b2a4a]' : 'bg-transparent border border-[#d0b06d] text-[#d0b06d]'"
        class="px-6 py-4 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 hover:brightness-110 active:scale-95"
      >
        <span>{{ orden === 'reciente' ? '📅 Más recientes' : '⏳ Más antiguos' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps(['busqueda', 'orden'])
defineEmits(['update:busqueda', 'buscar', 'toggle-orden'])
</script>
<template>
  <header class="bg-[#1b2a4a] text-white py-16 px-8 text-center">
    <h1 class="text-4xl font-extrabold mb-4">Encuentra tu próximo desafío profesional</h1>
    <p class="text-[#d0b06d] max-w-2xl mx-auto mb-8">
      Explora las mejores oportunidades laborales dentro de la red Nexa.
    </p>

    <div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-stretch justify-center">
      <div
        class="flex-1 bg-white p-1.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-4 focus-within:ring-[#D1B16D]/30 focus-within:border-[#D1B16D]/50">
        <div class="flex-1 flex items-center px-4 gap-3">
          <span class="text-gray-400">🔍</span>
          <input :value="busqueda" @input="$emit('update:busqueda', $event.target.value)" @keyup.enter="$emit('buscar')"
            type="text" placeholder="¿Qué puesto buscas hoy?"
            class="w-full py-3 text-slate-800 outline-none text-base font-medium placeholder:text-gray-400 bg-transparent" />
        </div>
        <button @click="$emit('buscar')"
          class="bg-[#1b2a4a] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#253b66] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
          Buscar
        </button>
      </div>

      <button @click="$emit('toggle-orden')"
        :class="ordenadoPorFecha ? 'bg-[#d0b06d] text-[#1b2a4a]' : 'bg-transparent border border-[#d0b06d] text-[#d0b06d]'"
        class="px-6 py-4 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-2 hover:brightness-110">
        📅 {{ ordenadoPorFecha ? 'Más recientes primero' : 'Ordenar por fecha' }}
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps(['busqueda', 'ordenadoPorFecha'])
defineEmits(['update:busqueda', 'buscar', 'toggle-orden'])
</script>
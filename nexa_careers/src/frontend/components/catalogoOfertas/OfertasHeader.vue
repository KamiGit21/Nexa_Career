<template>
  <header class="bg-[#1b2a4a] text-white py-16 px-8 text-center">
    <h1 class="text-4xl font-extrabold mb-4">Encuentra tu próximo desafío profesional</h1>
    <p class="text-[#d0b06d] max-w-2xl mx-auto mb-8">
      Explora las mejores oportunidades laborales dentro de la red Nexa.
    </p>

    <div class="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
      <div class="flex-1 w-full bg-white p-2 rounded-xl shadow-2xl flex gap-2">
        <div class="flex-1 flex items-center px-4 gap-2">
          <span class="text-gray-400">🔍</span>
          <input
            :value="busqueda"
            @input="$emit('update:busqueda', $event.target.value)"
            type="text"
            placeholder="Buscar por título..."
            class="w-full py-3 text-slate-800 outline-none text-sm rounded-lg"
          />
        </div>
        <button
          @click="$emit('buscar')"
          class="bg-[#1b2a4a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0f1a2e] transition-colors"
        >
          Buscar
        </button>
      </div>
      
      <button
        @click="$emit('toggle-orden')"
        :class="ordenadoPorFecha ? 'bg-[#d0b06d] text-[#1b2a4a]' : 'bg-transparent border border-[#d0b06d] text-[#d0b06d]'"
        class="px-6 py-4 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-2 hover:brightness-110"
      >
        📅 {{ ordenadoPorFecha ? 'Más recientes primero' : 'Ordenar por fecha' }}
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps(['busqueda', 'ordenadoPorFecha'])
defineEmits(['update:busqueda', 'buscar', 'toggle-orden'])
</script>
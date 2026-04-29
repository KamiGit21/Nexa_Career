<template>
  <header class="bg-[#1b2a4a] text-white py-16 px-8 text-center">
    <h1 class="text-4xl font-extrabold mb-4">Encuentra tu próximo desafío profesional</h1>
    <p class="text-[#d0b06d] max-w-2xl mx-auto mb-8">
      Explora las mejores oportunidades laborales dentro de la red Nexa.
    </p>

    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4">
      
      <div class="flex-1 w-full">
        <div
          class="bg-white p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 transition-all focus-within:ring-4 focus-within:ring-[#D1B16D]/30">

          <div class="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-gray-100">
            <span class="text-gray-400">🔍</span>
            <input :value="filtros.titulo" @input="updateFiltro('titulo', $event.target.value)"
              @keyup.enter="$emit('buscar')" type="text" placeholder="Puesto o palabra clave"
              class="w-full py-3 text-slate-800 outline-none text-sm font-medium placeholder:text-gray-400 bg-transparent" />
          </div>

          <div class="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-gray-100">
            <span class="text-gray-400">🏢</span>
            <input :value="filtros.empleador" @input="updateFiltro('empleador', $event.target.value)"
              @keyup.enter="$emit('buscar')" type="text" placeholder="Empresa..."
              class="w-full py-3 text-slate-800 outline-none text-sm font-medium placeholder:text-gray-400 bg-transparent" />
          </div>

          <div class="flex-[0.7] flex items-center px-4 gap-3">
            <span class="text-gray-400">📍</span>
            <select :value="filtros.modalidad" @change="updateFiltro('modalidad', $event.target.value)"
              class="w-full py-3 text-slate-800 outline-none text-sm font-medium bg-transparent cursor-pointer appearance-none">
              <option value="">Todas las modalidades</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          <button @click="$emit('buscar')"
            class="bg-[#1b2a4a] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#253b66] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
            Buscar
          </button>
        </div>
      </div>

      <div class="w-full lg:w-auto">
        <button @click="$emit('toggle-orden')"
          :class="ordenadoPorFecha ? 'bg-[#d0b06d] text-[#1b2a4a]' : 'bg-transparent border border-[#d0b06d] text-[#d0b06d]'"
          class="w-full lg:w-auto px-6 py-4 rounded-2xl font-bold transition-colors whitespace-nowrap text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg h-[64px] lg:h-[72px]">
          📅 {{ ordenadoPorFecha ? 'Más recientes' : 'Ordenar fecha' }}
        </button>
      </div>

    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  filtros: {
    type: Object,
    default: () => ({ titulo: '', empleador: '', modalidad: '' })
  },
  ordenadoPorFecha: Boolean
})
const emit = defineEmits(['update:filtros', 'buscar', 'toggle-orden'])

const updateFiltro = (campo, valor) => {
  emit('update:filtros', { ...props.filtros, [campo]: valor })
}
</script>
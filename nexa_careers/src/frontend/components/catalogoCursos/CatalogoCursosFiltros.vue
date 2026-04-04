<template>
  <div class="flex flex-wrap gap-3 mb-8 items-center">
    <!-- Búsqueda -->
    <div class="relative flex-1 min-w-[200px]">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        :value="busqueda"
        @input="$emit('update:busqueda', $event.target.value)"
        type="text"
        placeholder="Buscar por nombre..."
        class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1b2a4a] transition-colors"
      />
    </div>

    <!-- Filtro categorías -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cat in categorias"
        :key="cat"
        @click="$emit('update:categoriaActiva', cat)"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-semibold transition-colors',
          categoriaActiva === cat
            ? 'bg-[#1b2a4a] text-white'
            : 'bg-white border border-gray-200 text-gray-500 hover:border-[#1b2a4a] hover:text-[#1b2a4a]'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Ordenar -->
    <select
      :value="orden"
      @change="$emit('update:orden', $event.target.value)"
      class="border border-gray-200 rounded-xl text-xs px-3 py-2.5 text-gray-500 focus:outline-none focus:border-[#1b2a4a] transition-colors"
    >
      <option value="reciente">Más recientes</option>
      <option value="antiguo">Más antiguos</option>
      <option value="titulo">A → Z</option>
    </select>
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
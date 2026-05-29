<template>
  <div class="mb-6 bg-white rounded-2xl p-4 shadow-sm space-y-3">

    <!-- Buscador -->
    <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#1b2a4a] focus-within:border-transparent transition-all">
      <span class="text-gray-400">🔍</span>
      <input
        :value="busqueda"
        @input="$emit('update:busqueda', $event.target.value)"
        type="text"
        placeholder="Buscar por título de curso..."
        class="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-gray-400"
      />
      <button
        v-if="busqueda"
        @click="$emit('update:busqueda', '')"
        class="text-gray-400 hover:text-gray-600 text-xs"
      >✕</button>
    </div>

    <!-- Filtros por categoría y estado -->
    <div class="flex items-center gap-4 flex-wrap">

      <!-- Filtro por categoría -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600">Categoría:</span>
        <select
          :value="categoriaFiltro"
          @change="$emit('update:categoriaFiltro', $event.target.value === '' ? null : Number($event.target.value))"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:border-transparent bg-white"
        >
          <option value="">Todas</option>
          <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
            {{ cat.categoria }}
          </option>
        </select>
      </div>

      <!-- Filtro por estado -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600">Estado:</span>
        <select
          :value="estadoFiltro ?? ''"
          @change="$emit('update:estadoFiltro', $event.target.value === '' ? null : Number($event.target.value))"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:border-transparent bg-white"
        >
          <option value="">Todos</option>
          <option :value="0">Pendiente</option>
          <option :value="1">Aceptado</option>
          <option :value="2">Rechazado</option>
          <option :value="3">Archivado</option>
        </select>
      </div>

      <!-- Chips de filtros activos -->
      <div class="flex items-center gap-2 flex-wrap">
        <span
          v-if="categoriaFiltro"
          class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
        >
          {{ nombreCategoria }}
          <button @click="$emit('update:categoriaFiltro', null)" class="hover:text-blue-900">✕</button>
        </span>
        <span
          v-if="estadoFiltro !== null && estadoFiltro !== undefined"
          class="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
        >
          {{ nombresEstado[estadoFiltro] }}
          <button @click="$emit('update:estadoFiltro', null)" class="hover:text-purple-900">✕</button>
        </span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  busqueda:        { type: String, default: '' },
  categoriaFiltro: { default: null },
  estadoFiltro:    { default: null },
  categorias:      { type: Array, default: () => [] }
})

defineEmits(['update:busqueda', 'update:categoriaFiltro', 'update:estadoFiltro'])

const nombresEstado = { 0: 'Pendiente', 1: 'Aceptado', 2: 'Rechazado', 3: 'Archivado' }

const nombreCategoria = computed(() =>
  props.categorias.find(c => c.id_categoria === props.categoriaFiltro)?.categoria || ''
)
</script>
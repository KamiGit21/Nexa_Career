<template>
  <div class="mb-6 bg-white rounded-2xl p-4 shadow-sm">
    <div class="flex items-center gap-4 flex-wrap">

      <!-- Búsqueda por título -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-600">Buscar:</span>
        <input
          :value="busqueda"
          @input="$emit('update:busqueda', $event.target.value)"
          type="text"
          placeholder="Título, categoría o descripción..."
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:border-transparent bg-white w-64"
        />
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
          <option :value="1">Aprobada</option>
          <option :value="2">Rechazada</option>
          <option :value="3">Archivada</option>
          <option :value="4">Vencida</option>
        </select>
      </div>

      <!-- Chips de filtros activos -->
      <div class="flex items-center gap-2 flex-wrap">
        <span
          v-if="busqueda.trim()"
          class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
        >
          "{{ busqueda }}"
          <button @click="$emit('update:busqueda', '')" class="hover:text-blue-900">✕</button>
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
defineProps({
  busqueda:     { type: String, default: '' },
  estadoFiltro: { default: null }
})

defineEmits(['update:busqueda', 'update:estadoFiltro'])

const nombresEstado = { 0: 'Pendiente', 1: 'Aprobada', 2: 'Rechazada', 3: 'Archivada', 4: 'Vencida' }
</script>
<template>
  <div class="flex flex-wrap justify-between items-center bg-white p-5 rounded-2xl shadow-sm mb-8 gap-4 border border-gray-100">
    <div class="flex items-center gap-3">
      <label class="text-[#002855] font-semibold text-sm">Estado:</label>
      <select
        :value="estado"
        @change="$emit('update:estado', $event.target.value)"
        class="border-2 border-gray-300 rounded-lg px-3 py-1.5 focus:border-[#b5943a] outline-none cursor-pointer text-sm bg-gray-50 hover:bg-white transition-colors"
      >
        <option value="Todos">Todos</option>
        <option value="0">Pendiente</option>
        <option value="1">Aprobada</option>
        <option value="2">Rechazada</option>
        <option value="3">Archivada</option>
      </select>
    </div>
    <div class="flex items-center gap-3">
      <label class="text-[#002855] font-semibold text-sm">Mostrar:</label>
      <select
        :value="itemsPorPagina"
        @change="$emit('update:itemsPorPagina', Number($event.target.value))"
        class="border-2 border-gray-300 rounded-lg px-3 py-1.5 focus:border-[#b5943a] outline-none cursor-pointer text-sm bg-gray-50 hover:bg-white transition-colors"
      >
        <option v-for="n in [9, 12, 15, 18, 24]" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  estado: { type: String, default: 'Todos' },
  itemsPorPagina: { type: Number, default: 12 }
})
defineEmits(['update:estado', 'update:itemsPorPagina'])
</script>
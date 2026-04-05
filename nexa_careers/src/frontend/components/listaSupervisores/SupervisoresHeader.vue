<!-- SupervisoresHeader.vue -->
<template>
  <div class="flex justify-between items-end mb-8">
    <div>
      <h1 class="text-3xl font-bold text-slate-800">Supervisores registrados</h1>
      <p class="text-gray-500 mt-1">{{ total }} supervisores en el sistema</p>
    </div>
    <input
      :value="busqueda"
      @input="$emit('update:busqueda', $event.target.value)"
      type="text"
      placeholder="🔍 Buscar por nombre o correo..."
      class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1b2a4a] w-72"
    />
  </div>
</template>
<script setup>
defineProps({ total: { type: Number, required: true }, busqueda: { type: String, required: true } })
defineEmits(['update:busqueda'])
</script>
<template>
  <div class="flex flex-wrap justify-between items-start gap-4 mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Gestión de Categorías</h1>
      <p class="text-sm text-slate-400 mt-1">
        Administra las categorías disponibles para ofertas y cursos.
      </p>
    </div>
    <button
      @click="$emit('nueva')"
      class="flex items-center gap-2 px-5 py-2.5 bg-[#1e293b] text-white text-sm
             font-semibold rounded-xl hover:bg-[#0f172a] transition-colors"
    >
      <span class="text-base leading-none">+</span>
      Nueva categoría
    </button>
  </div>
</template>

<script setup>
defineEmits(['nueva'])
</script>
<template>
  <div class="flex flex-wrap gap-4 mb-8 items-center justify-between">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cat in categorias"
        :key="cat"
        @click="$emit('update:categoriaActiva', cat)"
        :class="[
          'px-5 py-2 rounded-full text-xs font-bold transition-all border active:scale-95',
          categoriaActiva === cat
            ? 'bg-[#1b2a4a] text-[#d0b06d] border-[#1b2a4a] shadow-md'
            : 'bg-white border-gray-200 text-gray-500 hover:border-[#1b2a4a] hover:text-[#1b2a4a]'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!--<div class="w-full sm:w-auto">
      <select
        :value="orden"
        @change="$emit('update:orden', $event.target.value)"
        class="w-full sm:w-auto border border-gray-200 rounded-xl text-xs font-bold px-4 py-2.5 text-gray-500 focus:outline-none focus:border-[#1b2a4a] transition-all cursor-pointer bg-white"
      >
        <option value="reciente">Más recientes</option>
        <option value="antiguo">Más antiguos</option>
        <option value="titulo">A → Z</option>
      </select>
    </div>-->
  </div>
</template>

<script setup>
defineProps({
  categoriaActiva: { type: String, required: true },
  orden:           { type: String, required: true },
  categorias:      { type: Array,  required: true },
})
defineEmits(['update:categoriaActiva', 'update:orden'])
</script>
<template>
  <div v-if="historial.length" class="mt-4">
    <p class="text-xs text-slate-400 text-center mb-2">Historial reciente</p>
    <div class="flex flex-wrap gap-2 justify-center">
      <span
        v-for="item in historial"
        :key="item"
        class="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  historial: { type: Array, default: () => [] }
})
</script>
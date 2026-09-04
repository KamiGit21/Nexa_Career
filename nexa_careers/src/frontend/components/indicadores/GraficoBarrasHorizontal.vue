<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <h3 class="font-semibold text-slate-700 text-sm mb-4">{{ titulo }}</h3>
    <div class="space-y-3">
      <div v-for="(item, i) in categorias" :key="i" class="flex items-center gap-3">
        <span class="text-xs text-gray-500 w-28 truncate text-right flex-shrink-0">{{ item.nombre }}</span>
        <div class="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-5 rounded-full transition-all duration-500"
            :style="{ width: pct(item.cantidad) + '%', backgroundColor: color }"
          ></div>
        </div>
        <span class="text-xs font-bold text-slate-700 w-6 text-right flex-shrink-0">{{ item.cantidad }}</span>
      </div>
      <p v-if="!categorias.length" class="text-xs text-gray-400 text-center py-4">Sin datos</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo:     { type: String, required: true },
  categorias: { type: Array,  default: () => [] },
  color:      { type: String, default: '#1B2A4A' },
})

const maximo = computed(() =>
  props.categorias.length ? Math.max(...props.categorias.map(c => c.cantidad)) : 1
)

const pct = (cantidad) => Math.round((cantidad / maximo.value) * 100)
</script>
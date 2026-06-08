<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <h3 class="font-semibold text-slate-700 text-sm mb-4">{{ titulo }}</h3>
    <div class="flex items-center justify-around gap-4 flex-wrap">

      <div class="relative flex-shrink-0" style="width:110px; height:110px">
        <div class="w-full h-full rounded-full" :style="{ background: gradiente }"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="bg-white rounded-full flex flex-col items-center justify-center"
               style="width:68px; height:68px">
            <span class="text-lg font-bold text-slate-700">{{ total }}</span>
            <span class="text-[10px] text-gray-400">total</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div v-for="item in leyenda" :key="item.label" class="flex items-center gap-2 min-w-[140px]">
          <span class="w-3 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: item.color }"></span>
          <span class="text-xs text-gray-500 flex-1">{{ item.label }}</span>
          <span class="text-xs font-bold text-slate-700">{{ item.valor }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo:     { type: String, required: true },
  aprobados:  { type: Number, default: 0 },
  rechazados: { type: Number, default: 0 },
  pendientes: { type: Number, default: 0 },
})

const total = computed(() => props.aprobados + props.rechazados + props.pendientes)

const gradiente = computed(() => {
  if (total.value === 0) return 'conic-gradient(#e5e7eb 0% 100%)'
  const a = Math.round((props.aprobados  / total.value) * 100)
  const r = Math.round((props.rechazados / total.value) * 100)
  return `conic-gradient(#22c55e 0% ${a}%, #ef4444 ${a}% ${a + r}%, #f59e0b ${a + r}% 100%)`
})

const leyenda = computed(() => [
  { label: 'Aprobados',  valor: props.aprobados,  color: '#22c55e' },
  { label: 'Rechazados', valor: props.rechazados, color: '#ef4444' },
  { label: 'Pendientes', valor: props.pendientes, color: '#f59e0b' },
])
</script>
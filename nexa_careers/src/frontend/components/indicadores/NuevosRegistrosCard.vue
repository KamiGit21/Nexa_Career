<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <div class="flex items-center gap-2 mb-4">
      <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: color }"></span>
      <h3 class="font-semibold text-slate-700 text-sm">{{ titulo }}</h3>
    </div>

    <div class="flex justify-around text-center">
      <div>
        <p class="text-3xl font-bold" :style="{ color }">{{ ultimos7 }}</p>
        <p class="text-xs text-gray-400 mt-1">últimos 7 días</p>
      </div>
      <div class="w-px bg-gray-100 self-stretch"></div>
      <div>
        <p class="text-3xl font-bold text-slate-600">{{ ultimos30 }}</p>
        <p class="text-xs text-gray-400 mt-1">últimos 30 días</p>
      </div>
    </div>

    <div class="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-2 rounded-full transition-all duration-500"
        :style="{ width: porcentaje + '%', backgroundColor: color }"
      ></div>
    </div>
    <p class="text-xs text-gray-400 mt-1 text-right">{{ porcentaje }}% del mes en esta semana</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo:    { type: String, required: true },
  ultimos7:  { type: Number, default: 0 },
  ultimos30: { type: Number, default: 0 },
  color:     { type: String, default: '#1B2A4A' },
})

const porcentaje = computed(() =>
  props.ultimos30 > 0 ? Math.round((props.ultimos7 / props.ultimos30) * 100) : 0
)
</script>
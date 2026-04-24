<template>
  <div class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
    <div class="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
      <span class="text-xs font-semibold text-slate-400">{{ iniciales }}</span>
    </div>
    <div class="min-w-0">
      <p class="text-sm font-semibold text-slate-800 truncate">{{ nombreCompleto }}</p>
      <p class="text-xs text-slate-400 truncate">
        Estudiante · ID #{{ estudiante?.id_estudiante }} · {{ estudiante?.gmail }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estudiante: { type: Object, default: null }
})

const nombreCompleto = computed(() =>
  `${props.estudiante?.nombre || ''} ${props.estudiante?.apellido || ''}`.trim()
)

const iniciales = computed(() => {
  const n = props.estudiante?.nombre?.[0] || ''
  const a = props.estudiante?.apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
})
</script>
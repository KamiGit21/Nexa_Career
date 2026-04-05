<template>
  <div>
    <h3 class="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
      📋 Actividad registrada
      <span v-if="cargando" class="text-xs text-gray-400 font-normal">(cargando...)</span>
    </h3>

    <div
      v-if="!cargando && logs.length === 0"
      class="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl"
    >
      Sin actividad registrada
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="(log, i) in logs"
        :key="i"
        class="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl"
      >
        <div class="flex items-center gap-3">
          <span class="text-base">{{ iconoModulo(log.modulo) }}</span>
          <div>
            <p class="text-sm font-medium text-slate-700">{{ log.accion }}</p>
            <p class="text-xs text-gray-500 truncate max-w-xs">{{ log.detalle }}</p>
          </div>
        </div>
        <div class="text-right flex-shrink-0 ml-4">
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold" :class="claseEstado(log.estado)">
            {{ log.estado }}
          </span>
          <p class="text-xs text-gray-400 mt-1">{{ formatearFecha(log.fecha) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logs:    { type: Array,   required: true },
  cargando:{ type: Boolean, default: false }
})

const iconoModulo = (modulo) => ({ Ofertas: '💼', Cursos: '🎓' })[modulo] || '📌'

const claseEstado = (estado) => ({
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Aceptado:  'bg-green-100  text-green-700',
  Rechazado: 'bg-red-100    text-red-600',
  Archivado: 'bg-gray-100   text-gray-500',
})[estado] || 'bg-gray-100 text-gray-500'

const formatearFecha = (f) => {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
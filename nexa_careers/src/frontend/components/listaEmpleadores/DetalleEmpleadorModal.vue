<template>
  <Transition name="fade">
    <div
      v-if="empleador"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      @click.self="$emit('cerrar')"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="bg-[#1b2a4a] px-8 py-6 rounded-t-3xl flex justify-between items-start">
          <div>
            <h2 class="text-white text-xl font-bold">{{ empleador.empresa }}</h2>
            <p class="text-[#d0b06d] text-sm mt-1">{{ empleador.gmail }}</p>
          </div>
          <button @click="$emit('cerrar')" class="text-white/60 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div v-for="campo in campos" :key="campo.label">
              <p class="text-xs font-semibold text-gray-400 uppercase">{{ campo.label }}</p>
              <p class="text-sm text-slate-700 mt-0.5">{{ campo.valor }}</p>
            </div>
          </div>

          <div v-if="empleador.descripcion">
            <p class="text-xs font-semibold text-gray-400 uppercase mb-1">Descripción de la empresa</p>
            <p class="text-sm text-gray-600">{{ empleador.descripcion }}</p>
          </div>

          <LogsActividadPanel :logs="logs" :cargando="cargandoLogs" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import LogsActividadPanel from '../adminUsuarios/LogsActividadPanel.vue'

const props = defineProps({
  empleador:   { type: Object,  default: null },
  logs:        { type: Array,   default: () => [] },
  cargandoLogs:{ type: Boolean, default: false }
})
defineEmits(['cerrar'])

const formatearFecha = (f) => {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const campos = computed(() => {
  if (!props.empleador) return []
  return [
    { label: 'Teléfono',  valor: props.empleador.telefono || '—' },
    { label: 'Estado',    valor: props.empleador.activo ? 'Activo' : 'Inactivo' },
    { label: 'Registro',  valor: formatearFecha(props.empleador.creado_en) },
    { label: 'Ofertas',   valor: String(props.empleador.total_ofertas) },
    { label: 'Cursos',    valor: String(props.empleador.total_cursos) },
  ]
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
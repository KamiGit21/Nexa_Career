<template>
  <Transition name="fade">
    <div v-if="estudiante" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      @click.self="$emit('cerrar')">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <!-- Header -->
        <div class="bg-[#1b2a4a] px-8 py-6 rounded-t-3xl flex justify-between items-start">
          <div>
            <h2 class="text-white text-xl font-bold">{{ estudiante.nombre }} {{ estudiante.apellido }}</h2>
            <p class="text-[#d0b06d] text-sm mt-1">{{ estudiante.carrera || 'Sin carrera registrada' }}</p>
          </div>
          <button @click="$emit('cerrar')" class="text-white/60 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div class="p-8 space-y-6">

          <!-- Info primordial -->
          <div class="grid grid-cols-2 gap-4">
            <div v-for="campo in campos" :key="campo.label">
              <p class="text-xs font-semibold text-gray-400 uppercase">{{ campo.label }}</p>
              <p class="text-sm text-slate-700 mt-0.5">{{ campo.valor }}</p>
            </div>
          </div>

          <div v-if="estudiante.descripcion">
            <p class="text-xs font-semibold text-gray-400 uppercase mb-1">Descripción</p>
            <p class="text-sm text-gray-600">{{ estudiante.descripcion }}</p>
          </div>

          <div v-if="estudiante.habilidades">
            <p class="text-xs font-semibold text-gray-400 uppercase mb-1">Habilidades</p>
            <p class="text-sm text-gray-600">{{ estudiante.habilidades }}</p>
          </div>

          <div v-if="estudiante.educacion">
            <p class="text-xs font-semibold text-gray-400 uppercase mb-1">Educación</p>
            <p class="text-sm text-gray-600">{{ estudiante.educacion }}</p>
          </div>

          <div v-if="estudiante && !estudiante.activo"
            class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
            <div class="flex items-center mb-2">
              <span class="text-red-600 mr-2">🚫</span>
              <h3 class="text-red-800 font-bold text-sm uppercase">Cuenta Inhabilitada</h3>
            </div>
            <p class="text-gray-700 text-sm">
              <span class="font-semibold">Motivo del bloqueo:</span>
              {{ estudiante.motivo_bloqueo || 'No se especificó un motivo.' }}
            </p>
            <p class="text-gray-500 text-xs mt-2 italic">
              Bloqueado el: {{ formatearFecha(estudiante.fecha_bloqueo) }}
            </p>
          </div>

          <!-- Logs -->
          <LogsActividadPanel :logs="logs" :cargando="cargandoLogs" />

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import LogsActividadPanel from '../adminUsuarios/LogsActividadPanel.vue'
import UsuarioEstadoBadge from '../adminUsuarios/UsuarioEstadoBadge.vue'

const props = defineProps({
  estudiante: { type: Object, default: null },
  logs: { type: Array, default: () => [] },
  cargandoLogs: { type: Boolean, default: false }
})
defineEmits(['cerrar'])

const formatearFecha = (f) => {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const campos = computed(() => {
  if (!props.estudiante) return []
  return [
    { label: 'Correo', valor: props.estudiante.gmail || '—' },
    { label: 'Teléfono', valor: props.estudiante.telefono || '—' },
    { label: 'Estado', valor: props.estudiante.activo ? 'Activo' : 'Inactivo' },
    { label: 'Registro', valor: formatearFecha(props.estudiante.creado_en) },
    { label: 'CV', valor: props.estudiante.cv || 'No cargado' },
    { label: 'Postulaciones', valor: String(props.estudiante.total_postulaciones) },
  ]
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
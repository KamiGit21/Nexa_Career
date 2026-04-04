<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="font-bold text-[#1b2a4a] text-lg leading-tight">{{ curso.curso }}</h3>
      <CursoEstadoBadge :estado="curso.estado" />
    </div>
    <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ curso.descripcion || 'Sin descripción' }}</p>
    <div class="flex justify-between items-center text-xs text-gray-400">
      <span>📅 {{ formatearFecha(curso.fecha_creacion) }}</span>
      <span>📞 {{ curso.contacto }}</span>
    </div>
  </div>
</template>

<script setup>
import CursoEstadoBadge from './CursoEstadoBadge.vue'

defineProps({
  curso: { type: Object, required: true }
})

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>
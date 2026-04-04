<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">

    <h2 class="text-lg font-bold text-[#1b2a4a] mb-4">Detalles del curso</h2>

    <ul class="flex flex-col gap-3">
      <li class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Estado:</span>
        <CursoEstadoBadge :estado="curso.estado" />
      </li>
      <li class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Ofertante:</span>
        <span class="font-semibold text-gray-700 capitalize">{{ curso.tipo_publicador }}</span>
      </li>
      <li class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Creación:</span>
        <span class="font-semibold text-gray-700">{{ formatearFecha(curso.fecha_creacion) }}</span>
      </li>
      <li v-if="curso.categoria" class="flex justify-between items-start text-sm gap-2">
        <span class="text-gray-400 flex-shrink-0">Categorías:</span>
        <span class="font-semibold text-gray-700 text-right">{{ curso.categoria }}</span>
      </li>
      <li v-if="curso.contacto" class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Contacto:</span>
        <span class="font-semibold text-gray-700">{{ curso.contacto }}</span>
      </li>
    </ul>

  </div>
</template>

<script setup>
import CursoEstadoBadge from '../misCursos/CursoEstadoBadge.vue'

defineProps({
  curso: { type: Object, required: true }
})

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toISOString().slice(0, 10)
}
</script>
<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="font-bold text-[#1b2a4a] text-lg leading-tight">{{ curso.curso }}</h3>
      <CursoEstadoBadge :estado="curso.estado" />
    </div>

    <!-- Categorías -->
    <div v-if="curso.categorias && curso.categorias.length > 0" class="flex flex-wrap gap-1 mb-3">
      <span
        v-for="cat in curso.categorias"
        :key="cat.id_categoria"
        class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
      >
        {{ cat.categoria }}
      </span>
    </div>

    <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ curso.descripcion || 'Sin descripción' }}</p>

    <div class="flex justify-between items-center text-xs text-gray-400 mb-5">
      <span>📅 {{ formatearFecha(curso.fecha_creacion) }}</span>
      <span>📞 {{ curso.contacto }}</span>
    </div>

    <!-- Acciones -->
    <div class="border-t border-gray-100 pt-4">
      <!-- Curso archivado: mostrar botón para desarchivar -->
      <div v-if="curso.estado === 3" class="flex gap-2">
        <button
          @click="$emit('desarchivar', curso)"
          class="flex-1 py-2 text-xs font-semibold text-green-600
                 border border-green-200 rounded-xl hover:bg-green-50 transition-colors"
        >
          ♻️ Desarchivar
        </button>
      </div>

      <!-- Curso activo: mostrar botón dar de baja -->
      <div v-else class="flex gap-2">
        <button
          @click="$emit('dar-de-baja', curso)"
          class="flex-1 py-2 text-xs font-semibold text-red-600
                 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          🚫 Dar de Baja
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CursoEstadoBadge from './CursoEstadoBadge.vue'

defineProps({
  curso: { type: Object, required: true }
})

defineEmits(['editar', 'dar-de-baja', 'desarchivar'])

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>
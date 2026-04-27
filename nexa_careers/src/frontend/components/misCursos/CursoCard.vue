<!-- C:\xampp\htdocs\Nexa_Career\nexa_careers\src\frontend\components\misCursos\CursoCard.vue -->
<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="font-bold text-[#1b2a4a] text-lg leading-tight">{{ curso.curso }}</h3>
      <CursoEstadoBadge :estado="curso.estado" />
    </div>
    
    <!-- Mostrar categorías -->
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
<template>
  <div class="mb-6">
    
    <router-link to="/cursos" class="text-sm text-[#2e6da4] hover:underline">
      ← Volver al catálogo de cursos
    </router-link>

    <div class="mt-4 flex flex-wrap justify-between items-start gap-4">
      <div class="flex-1 min-w-[260px]">
        <!-- Categoría + estado -->
        <div class="flex items-center gap-2 mb-3 flex-wrap">
          <span class="text-xs font-semibold px-3 py-1 rounded-full" :class="colorCategoria">
            {{ curso.categoria || 'General' }}
          </span>
          <CursoEstadoBadge :estado="curso.estado" />
        </div>

        <h1 class="text-3xl font-bold text-[#1b2a4a] leading-tight mb-3">
          {{ curso.curso }}
        </h1>

        <!-- Autor -->
        <div class="flex items-center gap-2 flex-wrap text-sm text-gray-500">
          <span>Publicado por:</span>
          <div class="flex items-center gap-1.5">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              :class="colorAvatar"
            >
              {{ iniciales(curso.nombre_publicador) }}
            </div>
            <span class="font-semibold text-gray-700">{{ curso.nombre_publicador }}</span>
            <span class="capitalize text-gray-400">· {{ curso.tipo_publicador }}</span>
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-2">
          Fecha de creación: {{ formatearFecha(curso.fecha_creacion) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CursoEstadoBadge from '../misCursos/CursoEstadoBadge.vue'

const props = defineProps({
  curso: { type: Object, required: true }
})

const COLORES_CAT = [
  'bg-purple-100 text-purple-700', 'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',       'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
]
const COLORES_AVATAR = [
  'bg-indigo-500','bg-amber-500','bg-emerald-500',
  'bg-red-500','bg-blue-500','bg-violet-500'
]

const colorCategoria = computed(() => {
  const idx = (props.curso.categoria || '').charCodeAt(0) % COLORES_CAT.length
  return COLORES_CAT[idx]
})
const colorAvatar = computed(() => {
  const idx = (props.curso.nombre_publicador || '').charCodeAt(0) % COLORES_AVATAR.length
  return COLORES_AVATAR[idx]
})

const iniciales = (nombre = '') =>
  nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-5">

    <h2 class="text-lg font-bold text-[#1b2a4a] mb-3">Descripción del curso</h2>
    <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
      {{ curso.descripcion || 'Sin descripción disponible.' }}
    </p>

    <div v-if="tags.length" class="mt-5">
      <h3 class="text-sm font-bold text-[#1b2a4a] mb-2">Categorías</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="mt-5 pt-5 border-t border-gray-100">
      <h3 class="text-sm font-bold text-[#1b2a4a] mb-3">Sobre el ofertante</h3>
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          :class="colorAvatar"
        >
          {{ iniciales(curso.nombre_publicador) }}
        </div>
        <div>
          <p class="font-semibold text-gray-800">{{ curso.nombre_publicador }}</p>
          <p v-if="curso.especialidad" class="text-xs text-gray-500">{{ curso.especialidad }}</p>
          <p class="text-xs text-gray-400 capitalize">{{ curso.tipo_publicador }} activo en Nexa Careers</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  curso: { type: Object, required: true }
})

const tags = computed(() => {
  if (!props.curso.categoria) return []
  return props.curso.categoria.split(',').map(t => t.trim()).filter(Boolean)
})

const COLORES_AVATAR = [
  'bg-indigo-500','bg-amber-500','bg-emerald-500',
  'bg-red-500','bg-blue-500','bg-violet-500'
]
const colorAvatar = computed(() => {
  const idx = (props.curso.nombre_publicador || '').charCodeAt(0) % COLORES_AVATAR.length
  return COLORES_AVATAR[idx]
})

const iniciales = (nombre = '') =>
  nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
</script>
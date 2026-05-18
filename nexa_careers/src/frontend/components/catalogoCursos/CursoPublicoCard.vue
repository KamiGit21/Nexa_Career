<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
    :class="{ 'opacity-75 bg-gray-50': [2, 3].includes(curso.estado) }"
  >
    <div class="flex justify-between items-start mb-2">
      <span class="text-xs font-semibold px-3 py-1 rounded-full" :class="colorCategoria">
        {{ categoriaPrincipal || 'General' }}
      </span>

      <div class="flex flex-col items-end gap-1">
        <span :class="['text-[10px] font-bold px-2 py-1 rounded-full', estadoConfig.bg, estadoConfig.text]">
          {{ estadoConfig.label }}
        </span>
      </div>
    </div>

    <div @click="$emit('ver', curso.id_curso)" class="cursor-pointer">
      <h3 class="font-bold text-[#1b2a4a] text-lg leading-tight mt-3 mb-2 hover:text-[#b89b4d] transition-colors">
        {{ curso.curso }}
      </h3>

      <p class="text-sm text-gray-500 line-clamp-2 mb-5">
        {{ curso.descripcion || 'Sin descripción' }}
      </p>

      <div class="flex justify-between items-center pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            :class="colorAvatar"
          >
            {{ iniciales(curso.nombre_publicador) }}
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-semibold text-gray-700 leading-tight">{{ curso.nombre_publicador || '—' }}</span>
            <span class="text-xs text-gray-400 leading-tight capitalize">{{ curso.tipo_publicador }}</span>
          </div>
        </div>
        <span class="text-xs text-gray-400 font-medium">{{ formatearFecha(curso.fecha_creacion) }}</span>
      </div>
    </div>

    <button
      v-if="mostrarBotonBaja && ![2, 3].includes(curso.estado)"
      @click.stop="abrirModalBaja"
      class="mt-4 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-200"
    >
      🚫 Dar de Baja
    </button>

    <div
      v-if="mostrarBotonBaja && [2, 3].includes(curso.estado)"
      class="mt-4 w-full py-2 bg-gray-50 text-gray-500 font-semibold text-sm rounded-lg text-center border border-gray-200"
    >
      {{ curso.estado === 2 ? '❌ Curso rechazado' : '📦 Curso archivado' }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  curso: { type: Object, required: true },
  mostrarBotonBaja: { type: Boolean, default: false }
})

const emit = defineEmits(['ver', 'dar-baja'])

// Lógica de estados para cursos
const ESTADOS = {
  0: { label: 'Pendiente', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  1: { label: 'Aprobado',  bg: 'bg-green-100',  text: 'text-green-800'  },
  2: { label: 'Rechazado', bg: 'bg-red-100',    text: 'text-red-800'    },
  3: { label: 'Archivado', bg: 'bg-gray-100',   text: 'text-gray-500'   },
}

const estadoConfig = computed(() => ESTADOS[props.curso.estado] ?? ESTADOS[0])

const COLORES_CAT = [
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
]

const COLORES_AVATAR = [
  'bg-indigo-500', 'bg-amber-500', 'bg-emerald-500',
  'bg-red-500', 'bg-blue-500', 'bg-violet-500'
]

const colorCategoria = computed(() => {
  const idx = (categoriaPrincipal.value || '').charCodeAt(0) % COLORES_CAT.length
  return COLORES_CAT[idx]
})

const categoriaPrincipal = computed(() => {
  if (!props.curso.categorias || props.curso.categorias.length === 0) return null
  return props.curso.categorias[0].categoria
})

const colorAvatar = computed(() => {
  const idx = (props.curso.nombre_publicador || '').charCodeAt(0) % COLORES_AVATAR.length
  return COLORES_AVATAR[idx]
})

const iniciales = (nombre) =>
  (nombre || '').split(' ').map(p => p[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || '?'

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES')
}

const abrirModalBaja = () => {
  emit('dar-baja', props.curso)
}
</script>
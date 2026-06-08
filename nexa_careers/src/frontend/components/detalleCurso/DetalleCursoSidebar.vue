<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">

    <h2 class="text-lg font-bold text-[#1b2a4a] mb-4">Detalles del curso</h2>

    <button
      v-if="esEstudiante"
      @click="toggleFavorito"
      class="w-full mb-4 py-2.5 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-colors border"
      :class="favorito
        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'"
    >
      <span>{{ favorito ? '❤️' : '🤍' }}</span>
      {{ favorito ? 'Guardado en favoritos' : 'Guardar en favoritos' }}
    </button>

    <ul class="flex flex-col gap-3">
      <li class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Estado:</span>
        <CursoEstadoBadge :estado="curso.estado" />
      </li>
      <li class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Tipo ofertante:</span>
        <span class="font-semibold text-gray-700 capitalize">{{ curso.tipo_publicador }}</span>
      </li>
      <li class="flex justify-between items-start text-sm gap-2">
        <span class="text-gray-400 flex-shrink-0">Ofertante:</span>
        <span class="font-semibold text-gray-700 text-right">{{ curso.nombre_publicador || '—' }}</span>
      </li>
      <li class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Creación:</span>
        <span class="font-semibold text-gray-700">{{ formatearFecha(curso.fecha_creacion) }}</span>
      </li>
      <li v-if="categorias.length > 0" class="flex justify-between items-start text-sm gap-2">
        <span class="text-gray-400 flex-shrink-0">Categorías:</span>
        <div class="flex flex-wrap gap-1 justify-end">
          <span 
            v-for="cat in categorias" 
            :key="cat.id_categoria"
            class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
          >
            {{ cat.categoria }}
          </span>
        </div>
      </li>
      <li v-if="curso.contacto" class="flex justify-between items-center text-sm">
        <span class="text-gray-400">Contacto:</span>
        <span class="font-semibold text-gray-700">{{ curso.contacto }}</span>
      </li>
    </ul>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CursoEstadoBadge from '../misCursos/CursoEstadoBadge.vue'
import { guardarFavorito, eliminarFavorito } from '../../services/CursoFavoritos.js'

const props = defineProps({
  curso: { type: Object, required: true }
})

const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
const esEstudiante = sesion.rol === 'estudiante'
const favorito = ref(false)
// TODO (integración): inicializar con esCursoFavorito(sesion.id, props.curso.id_curso)

const toggleFavorito = async () => {
  if (favorito.value) {
    await eliminarFavorito(sesion.id, props.curso.id_curso)
  } else {
    await guardarFavorito(sesion.id, props.curso.id_curso)
  }
  favorito.value = !favorito.value
}

const categorias = computed(() => {
  return props.curso.categorias || []
})

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toISOString().slice(0, 10)
}
</script>
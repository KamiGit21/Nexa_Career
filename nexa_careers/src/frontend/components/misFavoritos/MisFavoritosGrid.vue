<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <CursoPublicoCard
      v-for="curso in cursos"
      :key="curso.id_curso"
      :curso="curso"
      @ver="(id) => emit('ver', id)"
    />
  </div>
</template>

<script setup>
import CursoPublicoCard from '../catalogoCursos/CursoPublicoCard.vue'

defineProps({
  cursos: { type: Array, required: true }
})

const emit = defineEmits(['ver'])
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <CursoPublicoCard
      v-for="curso in cursos"
      :key="curso.id_curso"
      :curso="curso"
      @ver="$emit('ver', $event)"
    />
  </div>
</template>

<script setup>
import CursoPublicoCard from './CursoPublicoCard.vue'

defineProps({
  cursos: { type: Array, required: true }
})

defineEmits(['ver'])
</script>
<template>
  <div class="gestion-grid">
    <GestionCursoCard
      v-for="curso in cursos"
      :key="curso.id"
      :curso="curso"
      @cambiar-estado="$emit('cambiar-estado', $event)"
    />
  </div>
</template>

<script>
import GestionCursoCard from './GestionCursoCard.vue'
export default {
  name: 'GestionCursosGrid',
  components: { GestionCursoCard },
  props: { cursos: { type: Array, required: true } },
  emits: ['cambiar-estado']
}
</script>

<style scoped>
.gestion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
</style>
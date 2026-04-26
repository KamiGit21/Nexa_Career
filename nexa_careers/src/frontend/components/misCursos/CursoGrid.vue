<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <CursoCard
      v-for="curso in cursos"
      :key="curso.id_curso"
      :curso="curso"
      @editar="$emit('editar', $event)"
      @dar-de-baja="$emit('dar-de-baja', $event)"
    />
  </div>
</template>

<script setup>
import CursoCard from './CursoCard.vue'

defineProps({
  cursos: { type: Array, required: true }
})

defineEmits(['editar', 'dar-de-baja'])
</script>
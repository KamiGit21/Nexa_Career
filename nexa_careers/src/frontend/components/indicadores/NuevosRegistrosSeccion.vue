<template>
  <section>
    <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Nuevos Registros</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuevosRegistrosCard
        titulo="Estudiantes"
        :ultimos7="datos.estudiantes7"
        :ultimos30="datos.estudiantes30"
        color="#B5943A"
      />
      <NuevosRegistrosCard
        titulo="Empleadores"
        :ultimos7="datos.empleadores7"
        :ultimos30="datos.empleadores30"
        color="#1B2A4A"
      />
    </div>
  </section>
</template>

<script setup>
import NuevosRegistrosCard from './NuevosRegistrosCard.vue'

defineProps({
  datos: {
    type: Object,
    default: () => ({
      estudiantes7: 0, estudiantes30: 0,
      empleadores7: 0, empleadores30: 0,
    }),
  },
})
</script>
<template>
  <section>
    <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
      Tasas de Aprobación y Rechazo
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <GraficoDonaAprobacion
        titulo="Ofertas Laborales"
        :aprobados="tasas.ofertasAprobadas"
        :rechazados="tasas.ofertasRechazadas"
        :pendientes="tasas.ofertasPendientes"
      />
      <GraficoDonaAprobacion
        titulo="Cursos"
        :aprobados="tasas.cursosAprobados"
        :rechazados="tasas.cursosRechazados"
        :pendientes="tasas.cursosPendientes"
      />
    </div>
  </section>
</template>

<script setup>
import GraficoDonaAprobacion from './GraficoDonaAprobacion.vue'

defineProps({
  tasas: {
    type: Object,
    default: () => ({
      ofertasAprobadas: 0, ofertasRechazadas: 0, ofertasPendientes: 0,
      cursosAprobados:  0, cursosRechazados:  0, cursosPendientes:  0,
    }),
  },
})
</script>
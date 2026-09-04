<template>
  <section>
    <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Totales del Sistema</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        v-for="kpi in kpis"
        :key="kpi.label"
        :label="kpi.label"
        :value="kpi.valor"
        :color="kpi.color"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import StatCard from '../dashboardSupervisor/StatCard.vue'

const props = defineProps({
  estudiantes:      { type: Number, default: 0 },
  empleadores:      { type: Number, default: 0 },
  ofertasActivas:   { type: Number, default: 0 },
  cursosPublicados: { type: Number, default: 0 },
})

const kpis = computed(() => [
  { label: 'Estudiantes registrados', valor: props.estudiantes,      color: '#B5943A' },
  { label: 'Empleadores registrados', valor: props.empleadores,      color: '#1B2A4A' },
  { label: 'Ofertas activas',         valor: props.ofertasActivas,   color: '#3B6D11' },
  { label: 'Cursos publicados',       valor: props.cursosPublicados, color: '#534AB7' },
])
</script>
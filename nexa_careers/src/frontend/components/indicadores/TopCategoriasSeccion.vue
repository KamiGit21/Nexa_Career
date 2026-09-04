<template>
  <section>
    <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
      Top 5 Categorías más Demandadas
    </h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <GraficoBarrasHorizontal
        titulo="En Ofertas Laborales"
        :categorias="categorias.ofertas"
        color="#3B6D11"
      />
      <GraficoBarrasHorizontal
        titulo="En Cursos"
        :categorias="categorias.cursos"
        color="#534AB7"
      />
    </div>
  </section>
</template>

<script setup>
import GraficoBarrasHorizontal from './GraficoBarrasHorizontal.vue'

defineProps({
  categorias: {
    type: Object,
    default: () => ({ ofertas: [], cursos: [] }),
  },
})
</script>
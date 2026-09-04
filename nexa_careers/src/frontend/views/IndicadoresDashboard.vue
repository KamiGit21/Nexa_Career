<template>
  <div class="space-y-10 p-2">

    <div>
      <h1 class="text-2xl font-bold text-slate-800">Indicadores de la Plataforma</h1>
      <p class="text-sm text-gray-500 mt-1">
        Visión general del estado del sistema · {{ fechaFormateada }}
      </p>
    </div>

    <KpiTotalesGrid
      :estudiantes="kpis.estudiantes"
      :empleadores="kpis.empleadores"
      :ofertasActivas="kpis.ofertasActivas"
      :cursosPublicados="kpis.cursosPublicados"
    />

    <NuevosRegistrosSeccion :datos="nuevosRegistros" />

    <GraficoTasasSeccion :tasas="tasas" />

    <TopCategoriasSeccion :categorias="categorias" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import KpiTotalesGrid         from '../components/indicadores/KpiTotalesGrid.vue'
import NuevosRegistrosSeccion from '../components/indicadores/NuevosRegistrosSeccion.vue'
import GraficoTasasSeccion    from '../components/indicadores/GraficoTasasSeccion.vue'
import TopCategoriasSeccion   from '../components/indicadores/TopCategoriasSeccion.vue'

const kpis = ref({ estudiantes: 0, empleadores: 0, ofertasActivas: 0, cursosPublicados: 0 })
const nuevosRegistros = ref({ estudiantes7: 0, estudiantes30: 0, empleadores7: 0, empleadores30: 0 })
const tasas = ref({
  ofertasAprobadas: 0, ofertasRechazadas: 0, ofertasPendientes: 0,
  cursosAprobados:  0, cursosRechazados:  0, cursosPendientes:  0,
})
const categorias = ref({ ofertas: [], cursos: [] })

const fechaFormateada = computed(() =>
  new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

onMounted(async () => {
  // reemplazar con el servicio real, ejemplo:

})
</script>
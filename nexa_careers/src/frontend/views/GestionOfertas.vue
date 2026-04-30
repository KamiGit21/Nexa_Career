<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] min-h-screen">

    <div class="bg-[#1b2a4a] py-8 px-6 text-center shadow-md">
      <h1 class="text-3xl font-bold text-[#D1B16D] mb-2">Gestión de Ofertas</h1>
      <p class="text-gray-300">Revisa y filtra todas las ofertas laborales de la plataforma.</p>
    </div>

    <main class="max-w-7xl mx-auto pt-8 pb-4 px-6">

      <OfertaFiltros
        :estado="estadoFiltro"
        :items-por-pagina="itemsPorPagina"
        @update:estado="estadoFiltro = $event; cargarOfertas(1)"
        @update:items-por-pagina="itemsPorPagina = $event; cargarOfertas(1)"
      />

      <div v-if="loading" class="text-center py-20 text-gray-500">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b2a4a] mx-auto mb-4"></div>
        Cargando ofertas...
      </div>

      <div v-else-if="ofertas.length === 0" class="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400">
        <p class="text-5xl mb-4">📂</p>
        <p class="text-lg font-medium">No hay ofertas que coincidan con este filtro.</p>
      </div>

      <template v-else>
        <p class="text-sm text-gray-500 mb-6 font-medium">
          Página <span class="text-[#1b2a4a]">{{ paginaActual }}</span> de <span class="text-[#1b2a4a]">{{ totalPaginas }}</span>
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OfertaCard
            v-for="oferta in ofertas"
            :key="oferta.id_oferta"
            :oferta="oferta"
            :mostrar-estado="true"
            @click-detalle="irDetalle"
          />
        </div>
        <CatalogoCursosPaginacion
          v-if="totalPaginas > 1"
          :pagina-actual="paginaActual"
          :total-paginas="totalPaginas"
          @cambiar="cargarOfertas"
        />
      </template>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import OfertaFiltros from '@/components/gestionOfertas/OfertaFiltros.vue'
import OfertaCard from '@/components/catalogoOfertas/OfertaCard.vue'
import CatalogoCursosPaginacion from '@/components/catalogoCursos/CatalogoCursosPaginacion.vue'
import { listarOfertasPaginadas, listarOfertasPaginadasPorEstado } from '@/services/supervisorService.js'
import { obtenerEmpleadorPorId } from '@/services/empleadorService.js'

const router = useRouter()
const route  = useRoute()

const estadoFiltro   = ref(route.query.estado ?? 'Todos')
const itemsPorPagina = ref(Number(route.query.size) || 12)
const paginaActual   = ref(Number(route.query.pagina) || 1)
const totalPaginas   = ref(1)
const ofertas        = ref([])
const loading        = ref(true)

const irDetalle = (id) => router.push(`/supervisor/oferta/${id}`)

const cargarOfertas = async (pagina = 1) => {
  loading.value = true
  paginaActual.value = pagina
  router.replace({ query: { estado: estadoFiltro.value, size: itemsPorPagina.value, pagina } })
  try {
    const res = await (estadoFiltro.value === 'Todos'
      ? listarOfertasPaginadas(pagina, itemsPorPagina.value)
      : listarOfertasPaginadasPorEstado(pagina, itemsPorPagina.value, estadoFiltro.value))
    if (res.success && res.data) {
      ofertas.value = await Promise.all(res.data.map(async o => {
        let nombre_empresa = '—'
        if (o.id_empleador) {
          const emp = await obtenerEmpleadorPorId(o.id_empleador)
          if (emp.success && emp.data) nombre_empresa = emp.data.empresa || emp.data.nombre || '—'
        }
        return { ...o, nombre_empresa }
      }))
      totalPaginas.value = res.paginas ?? 1
    }
  } catch (e) {
    console.error('Error al cargar ofertas:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => cargarOfertas(paginaActual.value))
</script>
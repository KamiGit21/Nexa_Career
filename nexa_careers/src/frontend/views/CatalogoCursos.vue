<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] overflow-hidden">

    <CatalogoCursosHeader v-model:busqueda="busqueda" :orden="orden" @buscar="cargarCursos"
      @toggle-orden="toggleOrden" />

    <CatalogoCursosFiltros
      v-model:categoriaActiva="categoriaActiva"
      v-model:orden="orden"
      v-model:rangoFecha="rangoFecha"
      :categorias="categoriasDisponibles"
    />

    <main class="max-w-7xl mx-auto pt-12 pb-4 px-6">

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando cursos...
      </div>

      <template v-else>
        <div v-if="cursosPaginados.length === 0" class="text-center py-20 text-gray-400">
          <p class="text-5xl mb-4">🔍</p>
          <p class="text-lg font-medium">No encontramos resultados para tu búsqueda</p>
          <button @click="restablecerFiltros" class="mt-4 text-[#1b2a4a] font-bold hover:underline">
            Limpiar todos los filtros
          </button>
        </div>

        <template v-else>
          <div class="flex justify-end items-center mb-6 gap-3">
            <label for="pageSize" class="text-[#002855] font-semibold text-sm">
              Cursos por página:
            </label>
            <select id="pageSize" v-model="itemsPorPagina"
              class="border-2 border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#b5943a] transition-colors cursor-pointer">
              <option v-for="n in opcionesPagina" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>

          <CursoPublicoGrid :cursos="cursosPaginados" @ver="irDetalle" />

          <CatalogoCursosPaginacion id="punto-final" v-if="totalPaginasComp > 1" :pagina-actual="paginaActual"
            :total-paginas="totalPaginasComp" @cambiar="cambiarPagina" />
        </template>
      </template>
    </main>
    <div class="min-h-screen bg-[#f8f5f0]">
      <BotonScroll />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { buscarCursosAvanzado, listarCategorias, filtrarCursosPorFechas } from '../services/cursoService.js'

import CatalogoCursosHeader from '../components/catalogoCursos/CatalogoCursosHeader.vue'
import CatalogoCursosFiltros from '../components/catalogoCursos/CatalogoCursosFiltros.vue'
import CursoPublicoGrid from '../components/catalogoCursos/CursoPublicoGrid.vue'
import CatalogoCursosPaginacion from '../components/catalogoCursos/CatalogoCursosPaginacion.vue'
import BotonScroll from '../components/comunes/BotonScroll.vue'


const router = useRouter()
const cursos = ref([])
const loading = ref(true)

const busqueda = ref('')
const categoriaActiva = ref('Todas')
const orden = ref('reciente')
const rangoFecha = ref({ preset: '', desde: '', hasta: '' })

const categoriasDisponibles = ref(['Todas'])
const itemsPorPagina = ref(15)
const opcionesPagina = [9, 12, 15, 18, 21, 24, 27, 30]
const paginaActual = ref(1)
const totalPaginas = ref(1)

// INTEGRACION: al integrar el backend, pasar rangoFecha dentro de filtros en cargarCursos()
// y reemplazar cursosPaginados por el resultado filtrado del servidor.

const cursosPaginados = computed(() => cursos.value)
const totalPaginasComp = computed(() => totalPaginas.value)

const toggleOrden = () => {
  orden.value = orden.value === 'reciente' ? 'antiguo' : 'reciente'
}

const cargarCategorias = async () => {
  const response = await listarCategorias()
  if (response.success && response.data) {
    categoriasDisponibles.value = ['Todas', ...response.data.map(c => c.categoria)]
  }
}

const cargarCursos = async () => {
  loading.value = true
  try {
    let fechaInicio = rangoFecha.value.desde;
    let fechaFin = rangoFecha.value.hasta;

    // Calcular fechas exactas si el usuario seleccionó un acceso rápido
    if (rangoFecha.value.preset && !fechaInicio) {
      const hoy = new Date();
      fechaFin = hoy.toISOString().split('T')[0];
      
      const inicio = new Date();
      if (rangoFecha.value.preset === 'semana') {
        inicio.setDate(hoy.getDate() - 7);
      } else if (rangoFecha.value.preset === 'mes') {
        inicio.setMonth(hoy.getMonth() - 1);
      }
      fechaInicio = inicio.toISOString().split('T')[0];
    }

    const filtros = {
      pagina: paginaActual.value,
      size: itemsPorPagina.value,
      q: busqueda.value.trim(),
      categoria: categoriaActiva.value === 'Todas' ? 'Todos' : categoriaActiva.value,
      orden: orden.value
    };

    if (fechaInicio && fechaFin) {
      filtros.fechaDesde = fechaInicio;
      filtros.fechaHasta = fechaFin;
    }

    const response = await buscarCursosAvanzado(filtros);
    
    if (response.success) {
      cursos.value = response.data || [];
      totalPaginas.value = response.paginas || 1;
    } else {
      cursos.value = [];
      totalPaginas.value = 1;
    }
  } catch (error) {
    console.error('Error cargando cursos:', error);
    cursos.value = [];
    totalPaginas.value = 1;
  } finally {
    loading.value = false;
  }
}
const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginasComp.value) return
  paginaActual.value = nuevaPagina
  window.scrollTo({ top: 0, behavior: 'smooth' })
  cargarCursos()
}

const restablecerFiltros = () => {
  busqueda.value = ''
  categoriaActiva.value = 'Todas'
  orden.value = 'reciente'
  rangoFecha.value = { preset: '', desde: '', hasta: '' }
  paginaActual.value = 1
  cargarCursos()
}

const irDetalle = (id) => router.push(`/cursos/${id}`)

watch([busqueda, categoriaActiva, orden, rangoFecha], () => {
  paginaActual.value = 1
  cargarCursos()
}, { deep: true })

watch(itemsPorPagina, () => {
  paginaActual.value = 1
  cargarCursos()
})

onMounted(async () => {
  await cargarCategorias()
  await cargarCursos()
})
</script>
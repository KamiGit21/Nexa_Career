<template>
  <div class="h-auto pb-20 bg-[#f8f5f0] overflow-hidden">
    <OfertasHeader
      :filtros="filtros"
      :ordenado-por-fecha="ordenadoPorFecha"
      @update:filtros="val => filtros = val"
      @buscar="cargarOfertas(1)"
      @toggle-orden="toggleOrden"
    />

    <main class="max-w-7xl mx-auto pt-12 pb-4 px-6">
      <div v-if="!loading && !error && ofertas.length > 0"
        class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <p class="text-sm text-gray-500">
          Página <span class="font-semibold text-[#1b2a4a]">{{ paginaActual }}</span> de
          <span class="font-semibold text-[#1b2a4a]">{{ totalPaginas }}</span>
        </p>

        <div class="flex items-center gap-3">
          <label for="pageSize" class="text-[#002855] font-semibold text-sm">
            Ofertas por página:
          </label>
          <select id="pageSize" v-model="limite"
            class="border-2 border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#b5943a] transition-colors cursor-pointer">
            <option v-for="n in opcionesPagina" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>

      <OfertaGrid
        :ofertas="ofertas"
        :loading="loading"
        :error="error"
        @reintentar="cargarOfertas(paginaActual)"
        @ver-detalle="verDetalle"
      />

      <CatalogoOfertasPaginacion
        v-if="!loading && !error && ofertas.length > 0"
        :pagina-actual="paginaActual"
        :total-paginas="totalPaginas"
        @cambiar="cambiarPagina"
      />
    </main>

    <BotonScroll />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { buscarOfertasAvanzado, actualizarVencimientos } from '../services/ofertaService.js'

import OfertasHeader             from '../components/catalogoOfertas/OfertasHeader.vue'
import OfertaGrid                from '../components/catalogoOfertas/OfertaGrid.vue'
import CatalogoOfertasPaginacion from '../components/catalogoOfertas/CatalogoOfertasPaginacion.vue'
import BotonScroll               from '../components/comunes/BotonScroll.vue'
import { obtenerEmpleadorPorId } from '../services/empleadorService.js'

const limite        = ref(15)
const opcionesPagina = [9, 12, 15, 18, 21, 24, 27, 30]
const router        = useRouter()
const loading       = ref(true)
const error         = ref(null)
const ofertas       = ref([])
const busqueda      = ref('')
const paginaActual  = ref(1)
const totalPaginas  = ref(1)
const ordenadoPorFecha = ref(false)

const filtros = ref({
  titulo:     '',
  empleador:  '',
  modalidad:  '',
  rangoFecha: { preset: '', desde: '', hasta: '' } // Cambiado a objeto para compatibilidad con backend
})

const toggleOrden = () => {
  ordenadoPorFecha.value = !ordenadoPorFecha.value
  cargarOfertas(1)
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
  cargarOfertas(nuevaPagina)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const verDetalle = (id) => router.push(`/ofertas/${id}`)

const cargarOfertas = async (pagina = 1) => {
  loading.value = true
  error.value = null
  paginaActual.value = pagina

  try {
    const payload = {
      pagina,
      size:       limite.value,
      titulo:     filtros.value.titulo,
      empleador:  filtros.value.empleador,
      modalidad:  filtros.value.modalidad,
      orden:      ordenadoPorFecha.value ? 'desc' : 'asc'
    }

    // Agregar rangoFecha solo si hay valores válidos en el objeto
    if (filtros.value.rangoFecha && (filtros.value.rangoFecha.preset || (filtros.value.rangoFecha.desde && filtros.value.rangoFecha.hasta))) {
      payload.rangoFecha = filtros.value.rangoFecha;
    }

    const response = await buscarOfertasAvanzado(payload)

    if (response.success && response.data) {
      const ofertasEnriquecidas = await Promise.all(
        response.data.map(async (oferta) => {
          let nombreEmpleador = 'Empresa Confidencial'
          if (oferta.id_empleador) {
            try {
              const empRes = await obtenerEmpleadorPorId(oferta.id_empleador)
              if (empRes && empRes.success && empRes.data) {
                const datosEmpresa = Array.isArray(empRes.data) ? empRes.data[0] : empRes.data
                nombreEmpleador = datosEmpresa.empresa || datosEmpresa.nombre || 'Empresa'
              }
            } catch (e) {
              console.error('Error buscando datos del empleador:', e)
            }
          }
          return { ...oferta, nombre_empleador: nombreEmpleador }
        })
      )
      ofertas.value = ofertasEnriquecidas
      totalPaginas.value = response.paginas || 1
    } else {
      ofertas.value = []
      error.value = 'No se encontraron ofertas con esos criterios.'
    }
  } catch (err) {
    error.value = 'Error de conexión con el servidor'
    console.error(err)
  } finally {
    loading.value = false
  }
}

watch(filtros, (nuevosFiltros) => {
  const estaVacio = !nuevosFiltros.titulo && !nuevosFiltros.empleador && !nuevosFiltros.modalidad && (!nuevosFiltros.rangoFecha || !nuevosFiltros.rangoFecha.preset);
  if (estaVacio) cargarOfertas(1)
}, { deep: true })

watch(busqueda, (nuevoValor) => {
  if (nuevoValor.trim() === '') cargarOfertas(1)
})

watch(limite, () => { cargarOfertas(1) })

onMounted(async () => {
  await actualizarVencimientos()
  cargarOfertas(1)
})
</script>
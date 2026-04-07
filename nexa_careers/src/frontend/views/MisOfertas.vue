<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Ofertas</h1>
          <p class="text-gray-500 mt-1">Gestiona las oportunidades que has publicado</p>
        </div>
        <router-link to="/mis-ofertas/nueva"
          class="px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium flex items-center gap-2 hover:bg-[#0f1a2e]">
          + Nueva Oferta
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">Cargando tus ofertas...</div>

      <div v-else-if="ofertas.length === 0" class="text-center py-20 text-gray-500">
        Aún no tienes ofertas publicadas.
      </div>

      <div v-else class="bg-white rounded-3xl shadow-sm overflow-hidden">
        <!-- Tabla header -->
        <div class="grid grid-cols-13 bg-[#1b2a4a] text-white text-sm py-5 px-8 font-medium">
          <div class="col-span-5">Oferta</div>
          <div class="col-span-2">Categoría</div>
          <div class="col-span-2">Apertura</div>
          <div class="col-span-1 text-center">Postulantes</div>
          <div class="col-span-3 text-center">Acciones</div>
        </div>

        <div v-for="oferta in ofertas" :key="oferta.id_oferta"
          class="grid grid-cols-12 items-center px-8 py-6 border-b hover:bg-gray-50">
          <div class="col-span-4">
            <p class="font-semibold text-[#1b2a4a]">{{ oferta.oferta }}</p>
            <p class="text-sm text-gray-500 line-clamp-2">{{ oferta.descripcion }}</p>
          </div>
          <div class="col-span-2">{{ oferta.categoria || 'General' }}</div>
          <div class="col-span-2">{{ formatearFecha(oferta.fecha_apertura) }}</div>
          <div class="col-span-1 text-center font-medium">{{ oferta.postulantes_count || 0 }}</div>

          <div class="col-span-3 text-center flex gap-3 justify-center"> <button
              @click="verPostulantes(oferta.id_oferta)"
              class="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition-colors">
              Postulantes
            </button>
            <button @click="editarOferta(oferta.id_oferta)"
              class="px-4 py-2 bg-yellow-500 text-white rounded-xl text-xs font-medium hover:bg-yellow-600 transition-colors">
              Editar
            </button>
            <button @click="prepararBaja(oferta)"
              class="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-medium hover:bg-red-700 transition-colors">
              Dar de Baja
            </button>
          </div>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <span class="text-red-600 text-3xl">⚠️</span>
            </div>
            <h3 class="text-xl font-bold text-[#1b2a4a] mb-2">¿Está seguro que desea cerrar esta oferta?</h3>
            <p class="text-gray-500 mb-8">
              Estás a punto de dar de baja la oferta: <br>
              <span class="font-bold text-slate-800">"{{ ofertaSeleccionada?.oferta }}"</span>.
            </p>

            <div class="flex gap-4">
              <button @click="showModal = false"
                class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button @click="confirmarBaja"
                class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                Sí, Dar de Baja
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarOfertasPorEmpleador } from '../services/ofertaService.js'
import { obtenerNumeroPostulacionesPorOferta } from '../services/postulacionService.js'

const router = useRouter()
const ofertas = ref([])
const loading = ref(true)

const showModal = ref(false)
const ofertaSeleccionada = ref(null)

const prepararBaja = (oferta) => {
  ofertaSeleccionada.value = oferta
  showModal.value = true
}

const confirmarBaja = async () => {
  console.log('Iniciando proceso de baja para ID:', ofertaSeleccionada.value.id_oferta)

  //Funcion de eliminar logica

  showModal.value = false
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'No especificada'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES')
}

const cargarOfertas = async () => {
  loading.value = true
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion'))
    if (!sesion || sesion.rol !== 'empleador') {
      router.push('/inicio-sesion')
      return
    }

    const idEmpleador = sesion.id
    console.log('Cargando ofertas para empleador:', idEmpleador)

    const response = await listarOfertasPorEmpleador(idEmpleador)
    console.log('Respuesta del backend:', response)

    if (response.success) {
     
      const ofertasBase = response.data || []
      
      const ofertasConConteo = await Promise.all(
        ofertasBase.map(async (oferta) => {
          const conteo = await obtenerNumeroPostulacionesPorOferta(oferta.id_oferta)
          return { ...oferta, postulantes_count: conteo }
        })
      )
      
      ofertas.value = ofertasConConteo
    } else {
      console.error('Error en respuesta:', response.message)
    }
  } catch (error) {
    console.error('Error al cargar ofertas:', error)
  } finally {
    loading.value = false
  }
}

const verPostulantes = (idOferta) => {
  router.push(`/mis-ofertas/${idOferta}/postulantes`)
}

const editarOferta = (idOferta) => {
  router.push(`/mis-ofertas/${idOferta}/editar`)
}

onMounted(cargarOfertas)
</script>

<style scoped>
/* Animacion de modal*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
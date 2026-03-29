<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <Navbar />

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
        <div class="grid grid-cols-12 bg-[#1b2a4a] text-white text-sm py-5 px-8 font-medium">
          <div class="col-span-5">Oferta</div>
          <div class="col-span-2">Categoría</div>
          <div class="col-span-2">Apertura</div>
          <div class="col-span-1 text-center">Postulantes</div>
          <div class="col-span-2 text-center">Acciones</div>
        </div>

        <div v-for="oferta in ofertas" :key="oferta.id_oferta" 
             class="grid grid-cols-12 items-center px-8 py-6 border-b hover:bg-gray-50">
          <div class="col-span-5">
            <p class="font-semibold text-[#1b2a4a]">{{ oferta.oferta }}</p>
            <p class="text-sm text-gray-500 line-clamp-2">{{ oferta.descripcion }}</p>
          </div>
          <div class="col-span-2">{{ oferta.categoria || 'General' }}</div>
          <div class="col-span-2">{{ formatearFecha(oferta.fecha_apertura) }}</div>
          <div class="col-span-1 text-center font-medium">{{ oferta.postulantes_count || 0 }}</div>
          <div class="col-span-2 text-center flex gap-2 justify-center">
            <button @click="verPostulantes(oferta.id_oferta)" 
                    class="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              Postulantes
            </button>
            <button @click="editarOferta(oferta.id_oferta)" 
                    class="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarOfertasPorEmpleador } from '../services/ofertaService.js'
// import Navbar from '@/components/layout/Navbar.vue' // Descomenta si el componente existe

const router = useRouter()
const ofertas = ref([])
const loading = ref(true)

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
      ofertas.value = response.data || []
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
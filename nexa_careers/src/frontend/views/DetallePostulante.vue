<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <Navbar />

    <div class="max-w-5xl mx-auto px-6 py-10">
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-[#1b2a4a] mb-8">
        ← Volver a postulantes
      </button>

      <div v-if="loading" class="text-center py-20">Cargando información del postulante...</div>

      <div v-else class="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-[#1b2a4a] to-[#002349] px-12 py-10 text-white">
          <h1 class="text-4xl font-bold">{{ postulante.nombre }} {{ postulante.apellido }}</h1>
          <p class="text-[#d0b06d] text-xl mt-1">{{ postulante.puesto }}</p>
        </div>

        <div class="p-10 space-y-8">
          <div>
            <h3 class="font-medium text-gray-500">Contacto</h3>
            <p class="mt-3">{{ postulante.correo }}</p>
            <p>{{ postulante.telefono }}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-500">Dirección</h3>
            <p class="mt-3">{{ postulante.direccion }}</p>
          </div>
          <!-- Aquí puedes agregar más secciones del CV según necesites -->
        </div>

        <div class="border-t p-8 flex gap-4">
          <button v-if="postulante.estado === 'Pendiente'" 
                  @click="aceptar"
                  class="flex-1 py-4 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700">
            Aceptar Postulante
          </button>
          <button v-if="postulante.estado === 'Pendiente'" 
                  @click="rechazar"
                  class="flex-1 py-4 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700">
            Rechazar Postulante
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const postulante = ref({
  nombre: '',
  apellido: '',
  gmail: '',
  telefono: '',
  carrera: '',
  educacion: '',
  habilidades: '',
  descripcion: '',
  cv: '',
  estadoPostulacion: 0 // 0: pendiente, 1: aceptado, 2: rechazado
})

// ID de la oferta viene como query param
const ofertaId = ref(null)

const cargarPostulante = async () => {
  loading.value = true
  error.value = null
  
  try {
    const estudianteId = route.params.id
    ofertaId.value = route.query.ofertaId
    
    if (!estudianteId) {
      throw new Error('ID de estudiante no válido')
    }
    
    // Obtener datos del estudiante
    const estudianteResponse = await fetch(`http://localhost:3003/api/estudiantes/${estudianteId}`)
    const estudianteData = await estudianteResponse.json()
    
    if (!estudianteData.success) {
      throw new Error(estudianteData.message || 'Error al cargar estudiante')
    }
    
    postulante.value = estudianteData.data
    
    // Si tenemos ID de oferta, obtenemos el estado de la postulación
    if (ofertaId.value) {
      const ofertanteResponse = await fetch(`http://localhost:3004/api/ofertantes/buscar?id_oferta=${ofertaId.value}&id_estudiante=${estudianteId}`)
      const ofertanteData = await ofertanteResponse.json()
      
      if (ofertanteData.success && ofertanteData.data) {
        postulante.value.estadoPostulacion = ofertanteData.data.estado
        postulante.value.id_ofertante = ofertanteData.data.id_ofertante
      }
    }
    
  } catch (e) {
    console.error('Error al cargar postulante:', e)
    error.value = e.message || 'Error al cargar la información del postulante'
  } finally {
    loading.value = false
  }
}

const cambiarEstado = async (nuevoEstado) => {
  try {
    if (!postulante.value.id_ofertante) {
      throw new Error('No se encontró la postulación')
    }
    
    const response = await fetch(`http://localhost:3004/api/ofertantes/${postulante.value.id_ofertante}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: nuevoEstado })
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Error al cambiar estado')
    }
    
    // Actualizar estado local
    postulante.value.estadoPostulacion = nuevoEstado
    
    const mensaje = nuevoEstado === 1 ? 'Postulante aceptado exitosamente' : 'Postulante rechazado exitosamente'
    alert(mensaje)
    
    // Redirigir de vuelta a la lista de postulantes después de 1 segundo
    setTimeout(() => {
      router.push(`/mis-ofertas/${ofertaId.value}/postulantes`)
    }, 1000)
    
  } catch (e) {
    console.error('Error al cambiar estado:', e)
    alert(e.message || 'Error al procesar la solicitud')
  }
}

onMounted(cargarPostulante)
</script>
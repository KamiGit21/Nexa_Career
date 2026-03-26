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
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const postulante = ref({})

// TODO: GET /api/estudiantes/:id
const cargarPostulante = async () => {
  loading.value = true
  try {
    // const id = route.params.id
    // const res = await fetch(`/api/estudiantes/${id}`)
    // postulante.value = await res.json()
    
    postulante.value = {}
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const aceptar = () => {
  // TODO: PUT /api/ofertante/:id { estado: 'aceptado' }
  alert('Postulante aceptado')
}

const rechazar = () => {
  // TODO: PUT /api/ofertante/:id { estado: 'rechazado' }
  alert('Postulante rechazado')
}

onMounted(cargarPostulante)
</script>
<template>
  <div class="bg-[#fffffd] w-full min-w-[1440px] min-h-screen relative">

    <!-- Navbar -->
    <div class="absolute top-0 left-0 w-full h-[126px] bg-[#1b2a4a]" />
    <nav class="absolute top-0 left-0 w-full h-[126px] flex items-center px-12 text-white">
      <router-link to="/mis-ofertas" class="text-[#d0b06d] text-[25px]">Mis Ofertas</router-link>
    </nav>

    <div class="pt-[180px] px-12">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-4xl font-semibold text-[#1b2a4a]">
            {{ postulante.nombre }} {{ postulante.apellido }}
          </h1>
          <p class="text-[#888888] mt-1">{{ postulante.puesto }}</p>
        </div>

        <div class="flex gap-4">
          <button v-if="postulante.estado === 'Pendiente'" 
                  @click="aceptar" 
                  class="px-8 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
            Aceptar Postulante
          </button>
          <button v-if="postulante.estado === 'Pendiente'" 
                  @click="rechazar" 
                  class="px-8 py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700">
            Rechazar Postulante
          </button>
        </div>
      </div>

      <!-- CV Container -->
      <div class="mt-10 bg-white border border-[#d0b06d] rounded-[15px] overflow-hidden flex min-h-[700px]">
        <!-- Sidebar -->
        <div class="w-[220px] bg-white border-r p-6">
          <div class="w-32 h-32 mx-auto bg-gray-200 rounded-2xl flex items-center justify-center text-6xl">👤</div>
          <div class="mt-6 text-center">
            <p class="font-semibold">{{ postulante.nombre }}</p>
            <p class="text-sm text-gray-500">{{ postulante.carrera }}</p>
          </div>
          <div class="mt-8 space-y-4 text-sm">
            <p>📞 {{ postulante.telefono }}</p>
            <p>✉ {{ postulante.correo }}</p>
            <p>📍 {{ postulante.direccion }}</p>
          </div>
        </div>

        <!-- Main CV Content -->
        <div class="flex-1 p-10 overflow-y-auto">
          <h2 class="text-2xl font-semibold mb-6">Experiencia Laboral</h2>
          <div v-for="(exp, i) in postulante.experiencias" :key="i" class="mb-8">
            <p class="font-medium">{{ exp.titulo }}</p>
            <p class="text-gray-500">{{ exp.empresa }}</p>
            <ul class="list-disc pl-5 mt-2 text-sm text-gray-600">
              <li v-for="(t, j) in exp.tareas" :key="j">{{ t }}</li>
            </ul>
          </div>

          <h2 class="text-2xl font-semibold mb-6 mt-12">Educación</h2>
          <div v-for="(edu, i) in postulante.educacion" :key="i" class="mb-4">
            <p class="font-medium">{{ edu.institucion }}</p>
            <p class="text-gray-500">{{ edu.detalle }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const postulante = ref({})

// TODO: GET /api/estudiantes/:id
const cargarPostulante = async () => {
  const id = route.params.id

  // Datos temporales
  postulante.value = {
    nombre: 'Lucía Gloria',
    apellido: 'Villegas Mendoza',
    puesto: 'Agente Comercial',
    telefono: '+591 71234567',
    correo: 'lucia.villegas@ucb.edu.bo',
    direccion: 'La Paz, Bolivia',
    carrera: 'Ingeniería Comercial',
    estado: 'Pendiente',
    experiencias: [
      { titulo: 'Agente Comercial', empresa: 'Inmobiliaria S.L.', tareas: ['Visitas a clientes', 'Captación de inmuebles'] }
    ],
    educacion: [
      { institucion: 'Universidad Católica Boliviana', detalle: 'Ingeniería Comercial - 2026' }
    ]
  }
}

const aceptar = () => {
  postulante.value.estado = 'Aceptado'
  // TODO: PUT /api/ofertante/:id { estado: 'aceptado' }
  alert('Postulante aceptado')
}

const rechazar = () => {
  postulante.value.estado = 'Rechazado'
  // TODO: PUT /api/ofertante/:id { estado: 'rechazado' }
  alert('Postulante rechazado')
}

onMounted(cargarPostulante)
</script>
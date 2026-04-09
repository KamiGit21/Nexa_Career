<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <router-link to="/mis-ofertas" class="hover:text-[#1b2a4a]">Mis Ofertas</router-link>
        <span>›</span>
        <span class="text-[#1b2a4a] font-medium">{{ resOferta || 'Cargando...' }}</span>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">Cargando postulantes...</div>

      <div v-else class="bg-white rounded-3xl shadow-sm overflow-hidden">
        
        <div class="grid grid-cols-12 bg-[#1b2a4a] text-white text-sm py-5 px-6 font-medium">
          <div class="col-span-3">Postulante</div>
          <div class="col-span-2">Correo</div>
          <div class="col-span-2">Teléfono</div>
          <div class="col-span-1">Fecha</div>
          <div class="col-span-1 text-center">CV</div>
          <div class="col-span-1 text-center">Estado</div> 
          <div class="col-span-2 text-center">Acciones</div>
        </div>

        <div v-if="filteredPostulantes.length === 0" class="text-center py-10 text-gray-500">
          No hay postulantes para mostrar.
        </div>

        <div v-for="p in filteredPostulantes" :key="p.id" class="grid grid-cols-12 items-center px-6 py-6 border-b hover:bg-gray-50">
          <div class="col-span-3 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" 
                 :style="{ backgroundColor: p.inicialesBg, color: p.inicialesColor }">
              {{ p.iniciales }}
            </div>
            <div class="min-w-0">
              <p class="font-semibold truncate">{{ p.nombre }}</p>
            </div>
          </div>
          <div class="col-span-2 text-sm truncate pr-2">{{ p.correo }}</div>
          
          <div class="col-span-2 text-sm text-gray-500 truncate">{{ p.telefono }}</div>
          
          <div class="col-span-1 text-sm text-gray-600 truncate">{{ p.fechaPostulacion }}</div>
          
          <div class="col-span-1 text-center text-sm">
            <a v-if="p.cv" :href="p.cv" target="_blank" class="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1">
              📄 Ver
            </a>
            <span v-else class="text-gray-400 text-xs italic">Sin CV</span>
          </div>

          <div class="col-span-1 flex justify-center">
            <span v-if="p.estado === 0" class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-bold border border-yellow-200">
              Pendiente
            </span>
            <span v-else-if="p.estado === 1" class="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold border border-green-200">
              Aceptado
            </span>
            <span v-else-if="p.estado === 2" class="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-bold border border-red-200">
              Rechazado
            </span>
          </div>

          <div class="col-span-2 flex justify-center gap-1 flex-wrap">
            <button v-if="p.estado !== 1" @click="actualizarEstado(p, 1)" 
              class="px-2 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
              Aceptar
            </button>
            
            <button v-if="p.estado !== 2" @click="actualizarEstado(p, 2)" 
              class="px-2 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors">
              Rechazar
            </button>
            
            <button @click="verDetalle(p)" 
              class="px-2 py-1.5 text-xs border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { obtenerTitulo } from '../services/ofertaService.js'
import { obtenerPostulantesPorOferta, cambiarEstadoPostulacion } from '../services/postulacionService.js'
import { obtenerEstudiantePorId } from '../services/estudianteService.js'

const route = useRoute()
const router = useRouter()

const busqueda = ref('')
const loading = ref(true)

const resOferta = ref('') 
const postulantes = ref([])

const filteredPostulantes = computed(() => {
  let list = postulantes.value
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    list = list.filter(p => p.nombre.toLowerCase().includes(q))
  }
  return list
})

const cargarDatos = async () => {
  loading.value = true
  try {
    const ofertaId = route.params.ofertaId
    resOferta.value = await obtenerTitulo(ofertaId)
    const resPostulaciones = await obtenerPostulantesPorOferta(ofertaId)

    if (resPostulaciones.success && resPostulaciones.data) {
      
      const postulantesCompletos = await Promise.all(
        resPostulaciones.data.map(async (postulacion) => {
          const resEstudiante = await obtenerEstudiantePorId(postulacion.id_estudiante)
          const estudiante = resEstudiante.success ? resEstudiante.data : {}

          const nombreCompleto = `${estudiante.nombre || 'Usuario'} ${estudiante.apellido || ''}`.trim()
          const iniciales = (estudiante.nombre ? estudiante.nombre[0] : 'U') + (estudiante.apellido ? estudiante.apellido[0] : '')
          
          const bgColors = ['#e0f2fe', '#dcfce3', '#fef08a', '#ffedd5', '#f3e8ff']
          const textColors = ['#0284c7', '#16a34a', '#ca8a04', '#ea580c', '#9333ea']
          const randIndex = Math.floor(Math.random() * bgColors.length)

          return {
            id: postulacion.id_postulante || postulacion.id_postulacion || postulacion.id,
            id_estudiante: postulacion.id_estudiante,
            nombre: nombreCompleto,
            correo: estudiante.gmail || 'Sin correo',
            telefono: estudiante.telefono || 'Sin teléfono',
            fechaPostulacion: 'Reciente', 
            estado: postulacion.estado,
            // aquiiii deberia aprecer el cv
            //cv: `http://localhost:3000/api/estudiantes/${postulacion.id_estudiante}/cv/ver`,
            cv: estudiante.cv ? `http://localhost:3000/api/estudiantes/${postulacion.id_estudiante}/cv/ver` : null,
            //o una url relativa
            //cv: estudiante.cv ? `/api/estudiantes/${postulacion.id_estudiante}/cv/ver` : null,
            iniciales: iniciales.toUpperCase(),
            inicialesBg: bgColors[randIndex],
            inicialesColor: textColors[randIndex]
          }
        })
      )
      postulantes.value = postulantesCompletos
    } else {
      postulantes.value = []
    }

  } catch (e) {
    console.error('Error cargando postulantes:', e)
    resOferta.value = 'Error al cargar oferta'
  } finally {
    loading.value = false
  }
}

// Actualiza el estado en la BD y en la vista
const actualizarEstado = async (postulante, nuevoEstado) => {
  if (!postulante.id) {
    alert('Fallo interno: No se detectó el ID de la postulación en la base de datos.')
    console.error("Falta el ID en el objeto:", postulante)
    return
  }

  try {
    const response = await cambiarEstadoPostulacion(postulante.id, nuevoEstado)
    
    if (response.success) {
      postulante.estado = nuevoEstado
    } else {
      alert('Hubo un error al actualizar el estado: ' + response.message)
    }
  } catch (error) {
    console.error('Error cambiando estado:', error)
    alert('Error de conexión al intentar cambiar el estado.')
  }
}

const verDetalle = (p) => router.push(`/postulante/${p.id_estudiante}`)

onMounted(cargarDatos)
</script>
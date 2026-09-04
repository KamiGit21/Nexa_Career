<template>
  <div class="min-h-screen bg-[#f4f7f6]">
    <div class="max-w-6xl mx-auto px-6 py-10">
      
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-[#1b2a4a] mb-8">
        ← Volver
      </button>

      <div v-if="loading" class="text-center py-20 font-medium text-gray-600">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b2a4a] mx-auto mb-4"></div>
        Cargando perfil de empresa...
      </div>

      <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div class="h-48 bg-[#1b2a4a] relative">
          <div class="absolute -bottom-12 left-12 w-32 h-32 bg-white rounded-2xl shadow-lg p-2 border border-gray-50 flex items-center justify-center">
             <span class="text-4xl font-bold text-[#1b2a4a]">
               {{ perfil.empresa ? perfil.empresa[0].toUpperCase() : 'E' }}
             </span>
          </div>
        </div>

        <div class="pt-16 pb-12 px-12">
          <div class="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 class="text-3xl font-bold text-slate-800">{{ perfil.empresa || 'Nombre de la Empresa' }}</h1>
              <div class="flex flex-wrap gap-4 mt-2 text-gray-500">
                <span class="flex items-center gap-1 text-sm">📧 {{ perfil.gmail }}</span>
                <span class="flex items-center gap-1 text-sm">📞 {{ perfil.telefono }}</span>
                <span v-if="perfil.creado_en" class="flex items-center gap-1 text-sm">📅 Miembro desde: {{ formatearFecha(perfil.creado_en) }}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <span :class="perfil.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" 
                    class="px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center">
                {{ perfil.activo ? 'Empresa Activa' : 'Empresa Inactiva' }}
              </span>
            </div>
          </div>

          <hr class="my-10 border-gray-100">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10">
            <div class="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div class="w-12 h-12 bg-[#1b2a4a]/5 rounded-xl flex items-center justify-center text-2xl">
                💼
              </div>
              <div>
                <p class="text-2xl font-black text-[#1b2a4a]">{{ stats.total_ofertas }}</p>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ofertas Publicadas</p>
              </div>
            </div>

            <div class="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div class="w-12 h-12 bg-[#b5943a]/5 rounded-xl flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <p class="text-2xl font-black text-[#1b2a4a]">{{ stats.total_cursos }}</p>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cursos Publicados</p>
              </div>
            </div>

            <div class="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div class="w-12 h-12 bg-green-500/5 rounded-xl flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <p class="text-2xl font-black text-[#1b2a4a]">{{ stats.estudiantes_seleccionados }}</p>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alumnos Seleccionados</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div class="md:col-span-2 space-y-8">
              <section>
                <h3 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-widest mb-4">Descripción de la Empresa</h3>
                <p class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {{ perfil.descripcion || 'Esta empresa aún no ha proporcionado una descripción corporativa.' }}
                </p>
              </section>

              <section class="pt-8 border-t border-gray-50">
                <h3 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-widest mb-4">Ofertas de Trabajo Recientes</h3>
                
                <div v-if="loadingOfertas" class="text-center py-6 text-gray-400">
                  Cargando vacantes...
                </div>
                
                <div v-else-if="ofertas.length === 0" class="bg-gray-50 rounded-2xl p-6 text-center text-gray-400 border border-dashed border-gray-200">
                  Esta empresa no tiene ofertas de trabajo publicadas actualmente.
                </div>

                <div v-else class="space-y-4">
                  <div 
                    v-for="oferta in ofertas" 
                    :key="oferta.id_oferta" 
                    @click="irAOferta(oferta.id_oferta)"
                    class="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white group"
                  >
                    <div class="flex justify-between items-start">
                      <h4 class="font-bold text-[#1b2a4a] text-lg group-hover:text-[#b5943a] transition-colors">
                        {{ oferta.oferta || oferta.titulo }}
                      </h4>
                      <span class="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-1 rounded-md whitespace-nowrap">
                        {{ formatearFecha(oferta.fecha_apertura) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 line-clamp-2 mt-2">{{ oferta.descripcion }}</p>
                    <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                      <span class="bg-[#eef2f6] text-[#002855] px-3 py-1 rounded-full">Modalidad: {{ oferta.modalidad || 'Presencial' }}</span>
                      <span :class="obtenerColorEstado(oferta.estado)" class="px-3 py-1 rounded-full border">
                        {{ obtenerTextoEstado(oferta.estado) }}
                      </span>
                    </div>
                  </div>
                </div>

              </section>
            </div>

            

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { obtenerEmpleadorPorId } from '@/services/empleadorService.js'
import { buscarOfertasPorEmpleadorConFiltro, contarOfertasEmpleador } from '@/services/ofertaService.js'
import { contarCursosEmpleador } from '@/services/cursoService.js'
import { contarOfertantesEmpleador } from '@/services/postulacionService.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)

const ofertas = ref([])
const loadingOfertas = ref(true)

const stats = ref({
  total_ofertas: 0,
  total_cursos: 0,
  estudiantes_seleccionados: 0
})

const perfil = ref({
  id_empleador: null,
  empresa: '',
  descripcion: '',
  telefono: null,
  gmail: '',
  creado_en: null,
  activo: 1
})

const formatearFecha = (fecha) => {
  if (!fecha) return '---'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const obtenerTextoEstado = (estado) => {
  switch (estado) {
    case 0: return 'Pendiente'
    case 1: return 'Activa'
    case 2: return 'Rechazada'
    case 3: return 'Archivada'
    case 4: return 'Vencida'
    default: return 'Desconocido'
  }
}

const obtenerColorEstado = (estado) => {
  switch (estado) {
    case 0: return 'bg-yellow-50 text-yellow-600 border-yellow-200'  // Pendiente
    case 1: return 'bg-green-50 text-green-600 border-green-200'    // Aceptado
    case 2: return 'bg-red-50 text-red-600 border-red-200'          // Rechazado
    case 3: return 'bg-gray-100 text-gray-600 border-gray-300'      // Archivado
    case 4: return 'bg-orange-50 text-orange-600 border-orange-200' // Vencida
    default: return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

const irAOferta = (idOferta) => {
  if (idOferta) {
    router.push(`/ofertas/${idOferta}`)
  }
}

const irAEditar = () => {
  router.push(`/perfil-empleador/${perfil.value.id_empleador}`)
}

const cargarDatos = async () => {
  loading.value = true
  try {
    const id = route.params.id;
    
    if (!id) {
      console.error("No se proporcionó un ID en la ruta");
      loading.value = false;
      return;
    }

    const respuesta = await obtenerEmpleadorPorId(id);

    if (respuesta && respuesta.success && respuesta.data) {
      const datosEmpresa = Array.isArray(respuesta.data) ? respuesta.data[0] : respuesta.data;
      Object.assign(perfil.value, datosEmpresa);

      try {
        const [resOfertas, resCursos, resPostulantes] = await Promise.all([
          contarOfertasEmpleador(id),
          contarCursosEmpleador(id),
          contarOfertantesEmpleador(id)
        ]);

        if (resOfertas && resOfertas.success && resOfertas.data) {
          stats.value.total_ofertas = resOfertas.data.total;
        }
        if (resCursos && resCursos.success && resCursos.data) {
          stats.value.total_cursos = resCursos.data.total;
        }
        if (resPostulantes && resPostulantes.success && resPostulantes.data) {
          stats.value.estudiantes_seleccionados = resPostulantes.data.total;
        }
      } catch (errStats) {
        console.error("Error al cargar las estadísticas del empleador:", errStats);
      }

      try {
        loadingOfertas.value = true;
        const respuestaOfertas = await buscarOfertasPorEmpleadorConFiltro(id, '', 1);
        
        if (respuestaOfertas && respuestaOfertas.success && Array.isArray(respuestaOfertas.data)) {
          ofertas.value = respuestaOfertas.data;
        } else if (Array.isArray(respuestaOfertas)) {
          ofertas.value = respuestaOfertas;
        } else if (respuestaOfertas && Array.isArray(respuestaOfertas.ofertas)) {
          ofertas.value = respuestaOfertas.ofertas;
        } else {
          ofertas.value = [];
        }
      } catch (err) {
        console.error("Error al cargar las ofertas del empleador:", err);
      } finally {
        loadingOfertas.value = false;
      }

    } else {
      console.error("Error al cargar el perfil de la empresa:", respuesta?.message);
    }
  } catch (error) {
    console.error("Error de conexión al cargar perfil:", error)
  } finally {
    loading.value = false
  }
}

onMounted(cargarDatos)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
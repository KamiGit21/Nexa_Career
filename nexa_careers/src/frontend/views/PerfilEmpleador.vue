<template>
  <div class="min-h-screen bg-[#f4f7f6]">
    <div class="max-w-6xl mx-auto px-6 py-10">
      
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-[#1b2a4a] mb-8">
        ← Volver
      </button>

      <div v-if="loading" class="text-center py-20 font-medium text-gray-600">
        Cargando perfil de empresa...
      </div>

      <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div class="h-48 bg-[#1b2a4a] relative">
          <div class="absolute -bottom-12 left-12 w-32 h-32 bg-white rounded-2xl shadow-lg p-2 border border-gray-50 flex items-center justify-center">
             <span class="text-4xl font-bold text-[#1b2a4a]">
               {{ perfil.empresa ? perfil.empresa[0] : 'E' }}
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
                <span class="flex items-center gap-1 text-sm">📅 Miembro desde: {{ formatearFecha(perfil.creado_en) }}</span>
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
                <div class="bg-gray-50 rounded-2xl p-6 text-center text-gray-400 border border-dashed border-gray-200">
                  Próximamente se mostrarán las vacantes aquí.
                </div>
              </section>
            </div>

            <div class="space-y-6">
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 class="text-slate-800 font-bold mb-4">Datos de Registro</h4>
                <div class="space-y-4">
                  <div>
                    <p class="text-xs text-gray-400 uppercase font-bold">ID Empleador</p>
                    <p class="text-slate-700 font-medium">#{{ perfil.id_empleador || '---' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 uppercase font-bold">Correo Corporativo</p>
                    <p class="text-slate-700 font-medium truncate">{{ perfil.gmail }}</p>
                  </div>
                </div>
              </div>
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

const route = useRoute()
const router = useRouter()
const loading = ref(true)

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

// integracion
const irAEditar = () => {
  router.push(`/perfil-empleador/${perfil.value.id_empleador}`)
}

const cargarDatos = async () => {
  loading.value = true
  try {
    // Santiii aqui va la integracion
    // Mientras simulo datos
    setTimeout(() => {
      perfil.value = {
        id_empleador: route.params.id || 1,
        empresa: "Tech Solutions Bolivia",
        descripcion: "Somos una empresa líder en desarrollo de software con sede en La Paz, enfocada en soluciones en la nube y transformación digital para el sector financiero.",
        telefono: 70012345,
        gmail: "contacto@techsolutions.bo",
        creado_en: "2026-01-15T14:30:00",
        activo: 1
      }
      loading.value = false
    }, 800)
  } catch (error) {
    console.error("Error al cargar perfil:", error)
    loading.value = false
  }
}

onMounted(cargarDatos)
</script>

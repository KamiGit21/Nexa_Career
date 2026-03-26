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
        <!-- Tabla -->
        <div class="grid grid-cols-12 bg-[#1b2a4a] text-white text-sm py-5 px-8 font-medium">
          <div class="col-span-5">Oferta</div>
          <div class="col-span-2">Categoría</div>
          <div class="col-span-2">Apertura</div>
          <div class="col-span-1 text-center">Postulantes</div>
          <div class="col-span-2 text-center">Estado</div>
        </div>

        <div v-for="oferta in ofertas" :key="oferta.id" 
             class="grid grid-cols-12 items-center px-8 py-6 border-b hover:bg-gray-50">
          <div class="col-span-5">
            <p class="font-semibold text-[#1b2a4a]">{{ oferta.titulo }}</p>
            <p class="text-sm text-gray-500">{{ oferta.descripcion }}</p>
          </div>
          <div class="col-span-2">{{ oferta.categoria }}</div>
          <div class="col-span-2">{{ oferta.apertura }}</div>
          <div class="col-span-1 text-center font-medium">{{ oferta.postulantes || 0 }}</div>
          <div class="col-span-2 text-center">
            <span class="px-5 py-1 text-xs rounded-full" 
                  :class="oferta.estado === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
              {{ oferta.estado }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const ofertas = ref([])
const loading = ref(true)

// TODO: GET /api/ofertas?id_empleador= (desde sesión)
const cargarOfertas = async () => {
  loading.value = true
  try {
    // const res = await fetch('/api/ofertas?id_empleador=' + userId)
    // ofertas.value = await res.json()
    
    // Por ahora vacío - se llenará desde backend
    ofertas.value = []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const verPostulantes = (oferta) => {
  router.push(`/mis-ofertas/${oferta.id}/postulantes`)
}

onMounted(cargarOfertas)
</script>
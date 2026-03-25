<template>
  <div class="w-full min-w-[1280px] min-h-[900px] flex flex-col" style="background:#f0f2f5">

    <!-- Navbar -->
    <nav class="w-full flex items-center justify-between px-8 bg-[#1b2a4a]" style="height:52px;">
      <div></div>
      <div class="flex items-center gap-8 mr-12 text-white text-[15px]">
        <router-link to="/home" class="hover:opacity-80">Home</router-link>
        <router-link to="/mis-ofertas" class="font-bold text-[#b5943a]">Mis Ofertas</router-link>
        <router-link to="/login" class="hover:opacity-80">Mi Cuenta</router-link>
      </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="w-full flex items-center px-8 bg-white border-b border-gray-200" style="height:40px;">
      <router-link to="/mis-ofertas" class="text-[#888888] hover:underline">Mis Ofertas</router-link>
      <span class="text-[#888888] mx-1">/</span>
      <span class="text-[#1b2a4a]">{{ oferta.titulo }}</span>
      <span class="text-[#888888] ml-1">/ Postulantes</span>
    </div>

    <main class="flex-1 px-[40px] py-[18px] flex flex-col gap-4">

      <!-- Header de la oferta -->
      <div class="w-full rounded-[10px] flex overflow-hidden bg-[#1b2a4a] min-h-[100px]">
        <div class="flex-1 px-[28px] py-[18px]">
          <div class="font-bold text-white text-[17px]">{{ oferta.titulo }}</div>
          <div class="flex items-center gap-3 flex-wrap mt-2">
            <span class="text-[11px] px-3 py-1 rounded bg-[#253554] text-white">{{ oferta.categoria }}</span>
            <span class="text-white text-xs">· {{ oferta.tipo }} · Apertura: {{ oferta.apertura }}</span>
          </div>
        </div>
        <div class="flex border-l border-[#253554]">
          <div class="px-[32px] py-[18px] text-center min-w-[140px] border-r border-[#253554]">
            <div class="text-white text-xs">Total postulantes</div>
            <div class="font-bold text-[#b5943a] text-3xl">{{ postulantes.length }}</div>
          </div>
          <div class="px-[32px] py-[18px] text-center min-w-[140px]">
            <div class="text-white text-xs">Pendientes</div>
            <div class="font-bold text-white text-3xl">{{ pendientes }}</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex gap-3 bg-white border border-gray-200 rounded-[8px] p-3">
        <input v-model="busqueda" placeholder="Buscar postulante..." 
               class="flex-1 px-4 py-2 bg-[#fafafa] border border-[#e0e0e0] rounded-[6px] text-sm" />
        <select v-model="filtroEstado" class="px-4 py-2 bg-[#fafafa] border border-[#e0e0e0] rounded-[6px] text-sm">
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aceptado">Aceptado</option>
          <option value="Rechazado">Rechazado</option>
        </select>
      </div>

      <!-- Tabla -->
      <div class="bg-white border border-gray-200 rounded-[8px] overflow-hidden">
        <div class="bg-[#1b2a4a] text-white text-xs font-bold flex px-4 py-3">
          <div class="w-10">#</div>
          <div class="flex-1">Postulante</div>
          <div class="w-48">Correo</div>
          <div class="w-40">Teléfono</div>
          <div class="w-36">Fecha</div>
          <div class="w-24">Estado</div>
          <div class="flex-1 text-center">Acciones</div>
        </div>

        <div v-for="(p, i) in filteredPostulantes" :key="p.id" 
             class="flex items-center px-4 py-3 border-t border-gray-200 hover:bg-gray-50"
             :style="{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }">

          <div class="w-10 text-[#888888]">{{ p.id }}</div>
          
          <div class="flex-1 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" 
                 :style="{ background: p.inicialesBg, color: p.inicialesColor }">
              {{ p.iniciales }}
            </div>
            <div>
              <div class="text-[#1b2a4a]">{{ p.nombre }}</div>
              <div class="text-xs text-[#888888]">{{ p.carrera }}</div>
            </div>
          </div>

          <div class="w-48 text-sm text-[#555555]">{{ p.correo }}</div>
          <div class="w-40 text-sm text-[#555555]">{{ p.telefono }}</div>
          <div class="w-36 text-sm text-[#555555]">{{ p.fechaPostulacion }}</div>

          <div class="w-24">
            <span :style="{ color: estadoConfig[p.estado].color }" class="text-xs font-medium">
              {{ p.estado }}
            </span>
          </div>

          <div class="flex-1 flex gap-2 justify-center">
            <button v-if="p.estado === 'Pendiente'" 
                    @click="aceptar(p)" 
                    class="px-4 py-1 text-xs border border-[#3b6d11] text-[#3b6d11] rounded hover:bg-green-50">
              Aceptar
            </button>
            <button v-if="p.estado === 'Pendiente'" 
                    @click="rechazar(p)" 
                    class="px-4 py-1 text-xs border border-[#a32d2d] text-[#a32d2d] rounded hover:bg-red-50">
              Rechazar
            </button>
            <button @click="verDetalle(p)" 
                    class="px-4 py-1 text-xs border border-[#1b2a4a] text-[#1b2a4a] rounded hover:bg-gray-50">
              Ver CV
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const busqueda = ref('')
const filtroEstado = ref('Todos')

const oferta = ref({ titulo: '', categoria: '', tipo: '', apertura: '' })
const postulantes = ref([])

const estadoConfig = {
  Pendiente: { color: '#ba7517' },
  Aceptado: { color: '#3b6d11' },
  Rechazado: { color: '#a32d2d' }
}

const pendientes = computed(() => postulantes.value.filter(p => p.estado === 'Pendiente').length)

const filteredPostulantes = computed(() => {
  let list = [...postulantes.value]
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    list = list.filter(p => p.nombre.toLowerCase().includes(q) || p.correo.toLowerCase().includes(q))
  }
  if (filtroEstado.value !== 'Todos') {
    list = list.filter(p => p.estado === filtroEstado.value)
  }
  return list
})

// TODO: GET /api/oferta/:ofertaId
// TODO: GET /api/ofertante?id_oferta=:ofertaId
const cargarDatos = async () => {
  const ofertaId = route.params.ofertaId

  // Simulación temporal
  oferta.value = { titulo: 'Desarrollador Backend', categoria: 'Tecnología', tipo: 'Tiempo completo', apertura: '01 mar 2026' }
  
  postulantes.value = [
    { id: 1, iniciales: 'AM', inicialesBg: '#dce8ff', inicialesColor: '#1b2a4a', nombre: 'Andrea Mamani', carrera: 'Ing. de Sistemas · 3er año', correo: 'a.mamani@ucb.edu.bo', telefono: '+591 73 456 789', fechaPostulacion: '18 mar 2026', estado: 'Pendiente' },
    { id: 2, iniciales: 'LR', inicialesBg: '#ede9ff', inicialesColor: '#533ab7', nombre: 'Luis Rojas', carrera: 'Ing. de Sistemas · 4to año', correo: 'l.rojas@ucb.edu.bo', telefono: '+591 76 123 456', fechaPostulacion: '17 mar 2026', estado: 'Aceptado' }
  ]
}

const aceptar = (p) => {
  p.estado = 'Aceptado'
  // TODO: PUT /api/ofertante/:id { estado: 'aceptado' }
}

const rechazar = (p) => {
  p.estado = 'Rechazado'
  // TODO: PUT /api/ofertante/:id { estado: 'rechazado' }
}

const verDetalle = (p) => {
  router.push(`/postulante/${p.id}`)
}

onMounted(cargarDatos)
</script>
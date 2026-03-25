<template>
  <div class="w-full min-w-[1024px] min-h-screen bg-[#f5f3ee] font-sans">

    <!-- Navbar -->
    <nav class="w-full bg-[#1b2a4a] h-[52px] flex items-center justify-between px-6 text-white">
      <div class="flex items-center gap-8">
        <router-link to="/home" class="hover:opacity-80">Home</router-link>
        <span class="font-bold text-[#b5943a]">Mis Ofertas</span>
      </div>
      <router-link to="/mis-ofertas/nueva"
                   class="bg-white text-[#1b2a4a] px-5 py-2 rounded font-semibold hover:bg-[#d0b06d] hover:text-white transition-colors">
        + Nueva Oferta
      </router-link>
    </nav>

    <div class="px-8 py-6">
      <h1 class="font-bold text-[#b5943a] text-[22px] mb-1">Mis Ofertas Laborales</h1>
      <p class="text-[#888888] text-[13px] mb-6">Gestiona las ofertas publicadas por tu empresa.</p>

      <!-- Filtros -->
      <div class="flex gap-3 mb-6">
        <input v-model="busqueda" placeholder="Buscar oferta..." 
               class="flex-1 max-w-md px-4 py-2 bg-white border border-[#e0e0e0] rounded-lg text-sm" />
        
        <select v-model="filtroEstado" class="px-4 py-2 bg-white border border-[#e0e0e0] rounded-lg text-sm">
          <option value="Todos">Estado: Todos</option>
          <option value="Activa">Activa</option>
          <option value="En revisión">En revisión</option>
          <option value="Rechazada">Rechazada</option>
          <option value="Cerrada">Cerrada</option>
        </select>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded border border-[#e0e0e0] overflow-hidden">
        <div class="bg-[#1b2a4a] text-white text-xs font-bold flex px-6 py-4">
          <div class="w-12">#</div>
          <div class="flex-[2]">Oferta</div>
          <div class="w-40">Categoría</div>
          <div class="w-32">Apertura</div>
          <div class="w-28 text-center">Postulantes</div>
          <div class="w-32">Estado</div>
          <div class="flex-1 text-center">Acciones</div>
        </div>

        <div v-for="(oferta, idx) in ofertasFiltradas" :key="oferta.id"
             class="flex items-center px-6 py-4 border-t border-gray-100 hover:bg-gray-50">
          
          <div class="w-12 text-[#888888] text-sm">{{ oferta.id }}</div>
          
          <div class="flex-[2]">
            <div class="text-[#1b2a4a] font-medium">{{ oferta.titulo }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ oferta.descripcion }}</div>
          </div>

          <div class="w-40">
            <span class="inline-block px-3 py-1 text-[11px] rounded" 
                  :style="{ color: oferta.catColor, backgroundColor: oferta.catBg }">
              {{ oferta.categoria }}
            </span>
          </div>

          <div class="w-32 text-sm text-gray-600">{{ oferta.apertura }}</div>

          <div class="w-28 text-center">
            <button @click="verPostulantes(oferta)" 
                    class="inline-block px-4 py-1 text-sm font-medium bg-[#e8f0fb] text-[#1b2a4a] rounded">
              {{ oferta.postulantes }}
            </button>
          </div>

          <div class="w-32">
            <span class="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded"
                  :style="{ color: oferta.estadoColor, backgroundColor: oferta.estadoBg }">
              <span class="w-2 h-2 rounded-full inline-block" :style="{ backgroundColor: oferta.estadoDot }"></span>
              {{ oferta.estado }}
            </span>
          </div>

          <div class="flex-1 flex gap-2 justify-end">
            <button @click="verPostulantes(oferta)" 
                    class="px-4 py-1 text-xs border border-[#1b2a4a] text-[#1b2a4a] rounded hover:bg-gray-100">
              Ver Postulantes
            </button>
            <button @click="eliminarOferta(oferta)" 
                    class="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div v-if="ofertasFiltradas.length === 0" class="text-center py-12 text-gray-500">
        No se encontraron ofertas con los filtros aplicados.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const busqueda = ref('')
const filtroEstado = ref('Todos')

const ofertas = ref([])

// TODO: GET /api/ofertas?id_empleador=...
const cargarOfertas = async () => {
  // const res = await fetch('/api/ofertas?id_empleador=')
  // ofertas.value = await res.json()

  // Datos temporales
  ofertas.value = [
    {
      id: '001',
      titulo: 'Desarrollador Backend',
      descripcion: 'Node.js · Tiempo completo · 1 año exp.',
      categoria: 'Tecnología',
      catColor: '#1b2a4a',
      catBg: '#e8f0fb',
      apertura: '01 mar 2026',
      postulantes: 12,
      estado: 'Activa',
      estadoColor: '#3b6d11',
      estadoBg: '#eaf4e0',
      estadoDot: '#3b6d11'
    },
    {
      id: '002',
      titulo: 'Diseñador UX/UI',
      descripcion: 'Figma · Portfolio requerido',
      categoria: 'Diseño',
      catColor: '#533ab7',
      catBg: '#ede9fb',
      apertura: '15 feb 2026',
      postulantes: 8,
      estado: 'En revisión',
      estadoColor: '#ba7517',
      estadoBg: '#fdf0e0',
      estadoDot: '#ba7517'
    }
  ]
}

const ofertasFiltradas = computed(() => {
  return ofertas.value.filter(o => {
    const matchBusqueda = !busqueda.value || o.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    const matchEstado = filtroEstado.value === 'Todos' || o.estado === filtroEstado.value
    return matchBusqueda && matchEstado
  })
})

const verPostulantes = (oferta) => {
  router.push(`/mis-ofertas/${oferta.id}/postulantes`)
}

const eliminarOferta = (oferta) => {
  if (confirm(`¿Eliminar la oferta "${oferta.titulo}"?`)) {
    // TODO: DELETE /api/ofertas/:id
    const idx = ofertas.value.findIndex(o => o.id === oferta.id)
    if (idx !== -1) ofertas.value.splice(idx, 1)
  }
}

onMounted(cargarOfertas)
</script>
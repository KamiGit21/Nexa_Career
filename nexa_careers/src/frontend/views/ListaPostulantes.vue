<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <router-link to="/mis-ofertas" class="hover:text-[#1b2a4a]">Mis Ofertas</router-link>
        <span>›</span>
        <span class="text-[#1b2a4a] font-medium">{{ oferta.titulo || 'Cargando...' }}</span>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">Cargando postulantes...</div>

      <div v-else class="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div class="grid grid-cols-12 bg-[#1b2a4a] text-white text-sm py-5 px-8 font-medium">
          <div class="col-span-5">Postulante</div>
          <div class="col-span-3">Contacto</div>
          <div class="col-span-2">Fecha</div>
          <div class="col-span-2 text-center">Acciones</div>
        </div>

        <div v-for="p in filteredPostulantes" :key="p.id" class="grid grid-cols-12 items-center px-8 py-6 border-b hover:bg-gray-50">
          <div class="col-span-5 flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold" 
                 :style="{ backgroundColor: p.inicialesBg, color: p.inicialesColor }">
              {{ p.iniciales }}
            </div>
            <div>
              <p class="font-semibold">{{ p.nombre }}</p>
              <p class="text-sm text-gray-500">{{ p.carrera }}</p>
            </div>
          </div>
          <div class="col-span-3 text-sm">{{ p.correo }}</div>
          <div class="col-span-2 text-sm">{{ p.fechaPostulacion }}</div>
          <div class="col-span-2 flex justify-end gap-3">
            <button @click="verDetalle(p)" class="px-5 py-2 text-xs border rounded-xl hover:bg-gray-100">Ver CV</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const busqueda = ref('')
const filtroEstado = ref('Todos')
const loading = ref(true)

const oferta = ref({})
const postulantes = ref([])

const filteredPostulantes = computed(() => {
  let list = postulantes.value
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    list = list.filter(p => p.nombre.toLowerCase().includes(q))
  }
  return list
})

// TODO: GET /api/oferta/:ofertaId
// TODO: GET /api/ofertante?id_oferta=
const cargarDatos = async () => {
  loading.value = true
  try {
    const ofertaId = route.params.ofertaId
    // const resOferta = await fetch(`/api/oferta/${ofertaId}`)
    // oferta.value = await resOferta.json()

    // const resPostulantes = await fetch(`/api/ofertante?id_oferta=${ofertaId}`)
    // postulantes.value = await resPostulantes.json()

    oferta.value = { titulo: 'Cargando...' }
    postulantes.value = []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const verDetalle = (p) => router.push(`/postulante/${p.id}`)

onMounted(cargarDatos)
</script>
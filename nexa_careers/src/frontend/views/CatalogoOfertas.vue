<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <Navbar />

    <header class="bg-[#1e293b] text-white py-16 px-8 text-center border-t border-slate-700">
      <h1 class="text-4xl font-extrabold mb-4">Encuentra tu próximo desafío profesional</h1>
      <p class="text-slate-400 max-w-2xl mx-auto mb-8">
        Explora las mejores oportunidades laborales en tecnología, diseño y negocios dentro de la red Nexa.
      </p>

      <div class="max-w-3xl mx-auto bg-white p-2 rounded-xl shadow-2xl flex flex-wrap md:flex-nowrap gap-2">
        <div class="flex-1 flex items-center px-4 gap-2 border-r border-gray-100">
          <span class="text-gray-400">🔍</span>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Cargo, empresa o palabra clave"
            class="w-full py-3 text-slate-800 outline-none text-sm"
            @keyup.enter="cargarOfertas"
          >
        </div>
        <div class="flex-1 flex items-center px-4 gap-2">
          <span class="text-gray-400">📍</span>
          <select
            v-model="ubicacion"
            class="w-full py-3 text-slate-800 outline-none text-sm bg-transparent"
            @change="cargarOfertas"
          >
            <option value="">Todas las ubicaciones</option>
            <!-- TODO: poblar desde API (cargarFiltros) -->
          </select>
        </div>
        <button
          @click="cargarOfertas"
          class="bg-[#1e293b] text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
        >
          Buscar
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-12 px-8 flex gap-8">
      <aside class="w-64 hidden lg:block">
        <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>⚙️</span> Filtrar por
        </h3>

        <div class="space-y-8">
          <!-- Categoría -->
          <div>
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Categoría</h4>
            <div class="space-y-2">
              <label
                v-for="cat in categorias"
                :key="cat"
                class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600"
              >
                <input
                  v-model="categoriasSeleccionadas"
                  type="checkbox"
                  :value="cat"
                  class="rounded border-gray-300 text-[#1e293b] focus:ring-[#1e293b]"
                >
                {{ cat }}
              </label>
            </div>
          </div>

          <!-- Modalidad -->
          <div>
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Modalidad</h4>
            <div class="space-y-2">
              <label
                v-for="mod in modalidades"
                :key="mod"
                class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600"
              >
                <input
                  v-model="modalidadesSeleccionadas"
                  type="checkbox"
                  :value="mod"
                  class="rounded border-gray-300"
                >
                {{ mod }}
              </label>
            </div>
          </div>
        </div>
      </aside>

      <section class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <p class="text-sm text-gray-500 font-medium">
            Mostrando <span class="text-slate-800 font-bold">{{ totalOfertas }} ofertas</span> activas
          </p>
          <select
            v-model="orden"
            class="bg-transparent text-sm font-semibold text-slate-700 outline-none"
            @change="cargarOfertas"
          >
            <option value="recientes">Más recientes</option>
            <option value="relevancia">Relevancia</option>
          </select>
        </div>

        <!-- Estados -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Skeleton simple (puedes mejorarlo) -->
          <div v-for="n in 6" :key="n" class="bg-white rounded-2xl border border-gray-200 p-6 h-80 animate-pulse"></div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="cargarOfertas" class="bg-[#1e293b] text-white px-6 py-3 rounded-lg">Reintentar</button>
        </div>

        <div v-else-if="!ofertas.length" class="text-center py-12 text-gray-500">
          No se encontraron ofertas con los filtros actuales.
        </div>

        <!-- Lista real -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="oferta in ofertas"
            :key="oferta.id"
            class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                <!-- TODO: <img :src="oferta.empleador?.logo" ... > -->
              </div>
              <span v-if="oferta.esNuevo" class="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-1 rounded uppercase">Nuevo</span>
            </div>

            <h2 class="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              {{ oferta.titulo }}
            </h2>
            <p class="text-sm text-yellow-600 font-semibold mb-3">{{ oferta.empleador?.nombre || 'Empresa' }}</p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                📍 {{ oferta.ubicacion }}
              </span>
              <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                🕒 {{ oferta.modalidad }}
              </span>
            </div>

            <p class="text-xs text-gray-500 line-clamp-2 mb-6">
              {{ oferta.descripcion }}
            </p>

            <div class="flex justify-between items-center pt-4 border-t border-gray-50">
              <span class="text-xs text-gray-400 font-medium italic">
                Publicado {{ oferta.fechaPublicacionRelativa }}
              </span>
              <router-link
                :to="`/ofertas/${oferta.id}`"
                class="text-[#1e293b] font-bold text-sm hover:underline flex items-center gap-1"
              >
                Ver detalle <span>→</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Paginación (se oculta si solo hay 1 página) -->
        <div v-if="totalPaginas > 1" class="mt-12 flex justify-center gap-2">
          <!-- TODO: implementar paginación real con ofertaService -->
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import ofertaService from '@/services/ofertaService.js'

const router = useRouter()

const busqueda = ref('')
const ubicacion = ref('')
const categoriasSeleccionadas = ref([])
const modalidadesSeleccionadas = ref([])
const orden = ref('recientes')

const ofertas = ref([])
const totalOfertas = ref(0)
const totalPaginas = ref(1)
const loading = ref(false)
const error = ref(null)

// TODO: cargar categorías y modalidades desde API (igual que en cargarFiltros)
const categorias = ref(['Tecnología', 'Diseño', 'Marketing', 'Finanzas'])
const modalidades = ref(['Remoto', 'Presencial', 'Híbrido'])

const cargarOfertas = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      busqueda: busqueda.value,
      ubicacion: ubicacion.value,
      categorias: categoriasSeleccionadas.value,
      modalidades: modalidadesSeleccionadas.value,
      orden: orden.value,
      pagina: 1,
      limite: 12
    }

    const res = await ofertaService.listarOfertas(params)
    ofertas.value = res.ofertas || []
    totalOfertas.value = res.total || 0
    // totalPaginas.value = res.totalPaginas || 1
  } catch (err) {
    error.value = 'Error al cargar las ofertas'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarOfertas()
})

// Re-cargar cuando cambien filtros
watch([busqueda, ubicacion, categoriasSeleccionadas, modalidadesSeleccionadas, orden], () => {
  cargarOfertas()
})
</script>
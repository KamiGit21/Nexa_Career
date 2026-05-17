<template>
  <div class="flex flex-col h-screen bg-[#F4F7FA]">
    <Navbar />
    
    <div class="flex flex-1 overflow-hidden">
      
      <main class="flex-1 overflow-y-auto p-8">
        <div class="max-w-6xl mx-auto mb-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Nexa AI Advisor</h1>
              </div>
              <p class="text-gray-500 text-lg">Optimiza tu perfil y descubre las vacantes que mejor se adaptan a tu experiencia.</p>
            </div>
            <button 
              @click="simularAnalisis"
              :disabled="isAnalyzing"
              class="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70"
            >
              <div class="relative z-10 flex items-center gap-3">
                <i v-if="!isAnalyzing" class="fas fa-wand-magic-sparkles"></i>
                <i v-else class="fas fa-circle-notch fa-spin"></i>
                <span>{{ isAnalyzing ? 'Procesando Perfil...' : 'Analizar mi CV' }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div class="lg:col-span-4 space-y-6">
            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 class="font-bold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-user-astronomer text-blue-500"></i> Perfil Extraído
                </h3>
              </div>
              
              <div class="p-6">
                <div v-if="hasResults" class="animate-fadeIn">
                  <div class="mb-6">
                    <label class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Rol Identificado</label>
                    <p class="text-xl font-bold text-gray-800">{{ aiData.profile.role }}</p>
                  </div>
                  
                  <div class="mb-6">
                    <label class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Skills Detectadas</label>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span v-for="skill in aiData.profile.skills" :key="skill" 
                        class="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <div class="p-4 bg-green-50 rounded-xl border border-green-100">
                    <h4 class="text-green-800 font-bold text-sm mb-1">Sugerencia de Mejora:</h4>
                    <p class="text-green-700 text-xs leading-relaxed">{{ aiData.profile.tip }}</p>
                  </div>
                </div>

                <div v-else class="text-center py-12">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-file-invoice text-gray-300 text-2xl"></i>
                  </div>
                  <p class="text-gray-400 text-sm">Presiona "Analizar" para ver los datos de tu CV actual.</p>
                </div>
              </div>
            </section>
          </div>

          <div class="lg:col-span-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-gray-800 text-xl">Ofertas con Mayor Compatibilidad</h3>
              <span v-if="hasResults" class="text-sm text-gray-500">{{ aiData.jobs.length }} resultados encontrados</span>
            </div>

            <div v-if="isAnalyzing" class="space-y-4">
              <div v-for="n in 3" :key="n" class="h-40 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
            </div>

            <div v-else-if="hasResults" class="space-y-4">
              <div v-for="job in aiData.jobs" :key="job.id" 
                class="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                <div class="flex justify-between items-start gap-4">
                  <div class="flex gap-4">
                    <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {{ job.company.charAt(0) }}
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ job.title }}</h4>
                      <p class="text-gray-500 font-medium">{{ job.company }} • {{ job.location }}</p>
                    </div>
                  </div>
                  <div class="text-center bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                    <span class="block text-2xl font-black text-blue-600">{{ job.match }}%</span>
                    <span class="text-[10px] font-bold text-blue-400 uppercase">Match</span>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="text-sm text-gray-600">
                    <span class="font-bold text-gray-400 uppercase text-[10px] block mb-1">¿Por qué encajas?</span>
                    {{ job.reason }}
                  </div>
                  <div class="flex flex-wrap gap-2 content-start justify-end">
                    <span v-for="tag in job.tags" :key="tag" class="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-bold">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
              <div class="max-w-xs mx-auto">
                <i class="fas fa-search-dollar text-5xl text-gray-200 mb-6"></i>
                <h4 class="text-xl font-bold text-gray-700 mb-2">Listo para el análisis</h4>
                <p class="text-gray-400 text-sm">Nuestro motor de IA comparará tus habilidades con cientos de ofertas activas en Nexa.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { analizarPerfilIA } from '../services/estudianteService.js'

const router = useRouter()

const isAnalyzing = ref(false)
const hasResults = ref(false)
const aiData = ref({
  profile: { role: '', skills: [], tip: '' },
  jobs: []
})
const idEstudiante = ref(null)

onMounted(() => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
  if (!sesion.id || sesion.rol !== 'estudiante') { 
    router.push('/login')
    return 
  }
  idEstudiante.value = sesion.id
})

const simularAnalisis = async () => {
  if (!idEstudiante.value) return;

  isAnalyzing.value = true;
  hasResults.value = false;

  try {
    // Llamada REAL al backend que ejecuta Gemini
    const response = await analizarPerfilIA(idEstudiante.value);
    
    if (response.success && response.data) {
      aiData.value = response.data;
      hasResults.value = true;
    } else {
      alert(response.message || 'No se encontraron coincidencias suficientes.');
    }
  } catch (error) {
    console.error('Error al contactar a la IA:', error);
    alert('Hubo un error de conexión con Nexa AI. Inténtalo de nuevo más tarde.');
  } finally {
    isAnalyzing.value = false;
  }
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
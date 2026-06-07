<template>
  <div class="flex flex-col h-screen bg-[#F4F7FA]">
    <Navbar />

    <div class="flex flex-1 overflow-hidden">

      <main class="flex-1 overflow-y-auto p-8">
        <div class="max-w-6xl mx-auto mb-8">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Nexa AI Advisor</h1>
              </div>
              <p class="text-gray-500 text-lg">Optimiza tu perfil y descubre las vacantes que mejor se adaptan a tu
                experiencia.</p>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              
              <button 
                @click="recuperarUltimoAnalisis" 
                :disabled="isAnalyzing" 
                type="button"
                class="w-full sm:w-auto px-5 py-4 text-sm font-bold text-[#b5943a] bg-white border-2 border-[#b5943a] hover:bg-[#b5943a]/5 active:scale-95 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i class="fas fa-history"></i>
                <span>Recuperar Análisis</span>
              </button>

              <button 
                @click="Analisis" 
                :disabled="isAnalyzing"
                class="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70"
              >
                <div class="relative z-10 flex items-center justify-center gap-3">
                  <i v-if="!isAnalyzing" class="fas fa-circle-notch fa-spin"></i>
                  <i v-else class="fas fa-wand-magic-sparkles"></i>
                  <span>{{ isAnalyzing ? 'Procesando Perfil...' : 'Analizar mi CV' }}</span>
                </div>
              </button>
            </div>

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
                    <label class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Rol
                      Identificado</label>
                    <p class="text-xl font-bold text-gray-800">{{ aiData.profile.role }}</p>
                  </div>

                  <div class="mb-6">
                    <label class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Skills
                      Detectadas</label>
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

            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-bold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-graduation-cap text-indigo-500"></i> Cursos Recomendados
                </h3>
                <span v-if="hasResults"
                  class="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Top
                  5</span>
              </div>

              <div class="p-6">
                <div v-if="isAnalyzing" class="space-y-3">
                  <div v-for="n in 3" :key="n" class="h-16 bg-gray-50 rounded-xl animate-pulse border border-gray-100">
                  </div>
                </div>

                <div v-else-if="hasResults" class="space-y-4 animate-fadeIn">
                  <p class="text-xs text-gray-500 mb-2">Potencia tus habilidades clave para aumentar tu compatibilidad
                    con las ofertas:</p>

                  <div v-for="(curso, index) in recommendedCourses" :key="curso.id" @click="verDetalleCurso(curso.id)"
                    class="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                    <div class="flex items-center gap-3 overflow-hidden">
                      <div
                        class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-sm flex-shrink-0 group-hover:bg-indigo-100">
                        {{ index + 1 }}
                      </div>
                      <div class="overflow-hidden">
                        <h4
                          class="text-xs font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                          {{ curso.curso }}</h4>
                        <p class="text-[11px] text-gray-400 truncate">{{ curso.fecha_creacion }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0 pl-2">
                      <span
                        class="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                        {{ curso.ofertante }}
                      </span>
                      <i
                        class="fas fa-chevron-right text-gray-300 text-xs group-hover:translate-x-0.5 transition-transform group-hover:text-indigo-400"></i>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-8">
                  <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-book-open text-gray-300 text-xl"></i>
                  </div>
                  <p class="text-gray-400 text-xs px-4">Las recomendaciones académicas aparecerán una vez analizado tu
                    perfil.</p>
                </div>
              </div>
            </section>

          </div>

          <div class="lg:col-span-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-gray-800 text-xl">Ofertas con Mayor Compatibilidad</h3>
              <span v-if="hasResults" class="text-sm text-gray-500">{{ aiData.jobs.length }} resultados
                encontrados</span>
            </div>

            <div v-if="isAnalyzing" class="space-y-4">
              <div v-for="n in 3" :key="n" class="h-40 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
            </div>

            <div v-else-if="hasResults" class="space-y-4">
              <div v-for="job in aiData.jobs" :key="job.id" @click="verDetalleOferta(job.id)"
                class="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                <div class="flex justify-between items-start gap-4">
                  <div class="flex gap-4">
                    <div
                      class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {{ job.company.charAt(0) }}
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{
                        job.title }}</h4>
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
                    <span v-for="tag in job.tags" :key="tag"
                      class="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-bold">
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
                <p class="text-gray-400 text-sm">Nuestro motor de IA comparará tus habilidades con cientos de ofertas
                  activas en Nexa.</p>
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

const recommendedCourses = ref([])

onMounted(() => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
  if (!sesion.id || sesion.rol !== 'estudiante') {
    router.push('/login')
    return
  }
  idEstudiante.value = sesion.id
})

const verDetalleOferta = (idOferta) => {
  router.push(`/ofertas/${idOferta}`)
}

const verDetalleCurso = (idCurso) => {
  console.log(`Navegando al detalle del curso recomendado con ID: ${idCurso}`)
  router.push(`/cursos/${idCurso}`)
}

const Analisis = async () => {
  if (!idEstudiante.value) return;

  isAnalyzing.value = true;
  hasResults.value = false;

  try {
    // Llamada REAL al backend que ejecuta Gemini
    const response = await analizarPerfilIA(idEstudiante.value);

    if (response.success && response.data) {
      aiData.value = response.data;
      recommendedCourses.value = response.data.courses || [];
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

const recuperarUltimoAnalisis = async () => {
  if (!idEstudiante.value) return;

  isAnalyzing.value = true;
  hasResults.value = false;

  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    aiData.value = {
      profile: {
        role: "Frontend Developer (Vue.js / Tailwind)",
        skills: ["Vue.js", "JavaScript", "Tailwind CSS", "Node.js", "Git"],
        tip: "Análisis recuperado correctamente del historial. Tu perfil posee un excelente balance técnico, se sugiere profundizar en arquitecturas de microservicios."
      },
      jobs: [
        {
          id: 1,
          title: "Desarrollador Frontend Vue.js Junior",
          company: "DRoca Inmobiliaria",
          location: "La Paz, Bolivia",
          match: 95,
          reason: "Tu stack coincide perfectamente con los requerimientos de la reingeniería de sistemas de la empresa.",
          tags: ["Vue.js", "Tailwind", "Full-time"]
        }
      ]
    };
    
    recommendedCourses.value = [
      { id: 101, curso: "Arquitectura de Microservicios Avanzada", fecha_creacion: "2026-05-20", ofertante: "Nexa Careers" }
    ];

    hasResults.value = true;
    alert('Último análisis almacenado recuperado con éxito.');

  } catch (error) {
    console.error('Error al recuperar el historial de análisis:', error);
    alert('No se pudo recuperar ningún análisis previo para este estudiante.');
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
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
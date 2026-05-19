<template>
  <div class="analisis-cv-container p-6 bg-white rounded-lg shadow-md border-t-4 border-[#D0B06D]">
    <h2 class="text-2xl font-bold mb-4 text-[#1B2A4A]">Análisis Inteligente de Perfil</h2>
    
    <div class="flex items-center justify-between mb-6 p-4 bg-[#f4f7fa] rounded-lg border border-gray-100">
      <div class="flex items-center">
        <i class="fas fa-file-pdf text-3xl text-red-500 mr-4"></i>
        <div>
          <p class="font-semibold text-[#1B2A4A]">Tu CV actual está listo</p>
          <p class="text-sm text-gray-500">Última actualización: {{ fechaActualizacion }}</p>
        </div>
      </div>
      <button 
        @click="iniciarAnalisis" 
        :disabled="analizando"
        class="px-6 py-2 bg-[#1B2A4A] text-[#D0B06D] font-bold rounded-full hover:bg-[#253a66] transition disabled:bg-gray-400"
      >
        <span v-if="!analizando">Analizar contra Ofertas</span>
        <span v-else><i class="fas fa-spinner fa-spin mr-2"></i>Analizando...</span>
      </button>
    </div>

    <div v-if="resultados.length > 0" class="results-section mt-8">
      <h3 class="text-xl font-semibold mb-4 text-[#1B2A4A]">Mejores coincidencias para ti:</h3>
      <div class="grid gap-4">
        <div v-for="oferta in resultados" :key="oferta.id" class="border border-gray-200 rounded-lg p-4 hover:border-[#D0B06D] transition-all">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-bold text-lg text-[#1B2A4A]">{{ oferta.titulo }}</h4>
              <p class="text-[#D0B06D] font-semibold">{{ oferta.empresa }}</p>
            </div>
            <div class="text-right">
              <span :class="getMatchClass(oferta.matchScore)" class="text-sm font-bold px-3 py-1 rounded-full border">
                {{ oferta.matchScore }}% Match
              </span>
            </div>
          </div>
          <p class="mt-3 text-sm text-gray-600 line-clamp-2 italic">"{{ oferta.justificacionIA }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import estudianteService from '@/services/estudianteService';

export default {
  name: 'AnalisisCV',
  data() {
    return {
      analizando: false,
      fechaActualizacion: '14/05/2026',
      resultados: []
    };
  },
  methods: {
    async iniciarAnalisis() {
      this.analizando = true;
      try {
        //const response = await estudianteService.obtenerAnalisisIA();
        //this.resultados = response.data;
      } catch (error) {
        console.error("Error en el análisis:", error);
      } finally {
        this.analizando = false;
      }
    },
    getMatchClass(score) {
      if (score >= 80) return 'bg-[#D0B06D] text-[#1B2A4A] border-[#D0B06D]';
      return 'bg-white text-gray-600 border-gray-200';
    }
  }
};
</script>
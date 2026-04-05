<template>
  <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative flex flex-col h-full">
    
    <div class="flex items-start gap-4 mb-5">
      <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-xl text-[#002349] border border-gray-200 flex-shrink-0">
        {{ companyInitials }}
      </div>
      
      <div class="flex-grow">
        <h3 class="text-xl font-bold text-[#002349] leading-tight">
          {{ postulacion.jobTitle }}
        </h3>
        <p class="text-md font-medium text-[#D1B16D]">
          {{ postulacion.companyName }}
        </p>
        <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span>📍 {{ postulacion.location }}</span>
        </div>
      </div>
    </div>

    <p class="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
      {{ postulacion.descriptionSnippet }}
    </p>

    <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
      <span class="text-xs text-gray-400">
        Publicado hace {{ postulacion.daysAgo }} días
      </span>
      
      <span :class="statusClasses">
        {{ postulacion.status }}
      </span>
    </div>

    <a href="#" class="absolute inset-0 z-10 rounded-2xl" aria-label="Ver detalles de la postulación"></a>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  postulacion: {
    type: Object,
    required: true,
  }
});

// Obtener iniciales de la empresa
const companyInitials = computed(() => {
  return props.postulacion.companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

const statusClasses = computed(() => {
  const baseClasses = "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner";
  
  switch (props.postulacion.status) {
    case 'Pendiente':
      return `${baseClasses} bg-sky-100 text-sky-700`;
    case 'Seleccionado':
      return `${baseClasses} bg-emerald-100 text-emerald-700`;
    case 'No seleccionado':
      return `${baseClasses} bg-red-100 text-red-700`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
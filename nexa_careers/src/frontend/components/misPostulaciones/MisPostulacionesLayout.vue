<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <MisPostulacionesHeader />
      
      <MisPostulacionesFiltros
        @search="handleSearch"
        @filter="handleFilter"
      />
      
      <PostulacionGrid
        :postulaciones="filteredPostulaciones"
        :loading="isLoading"
      />
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MisPostulacionesHeader from './MisPostulacionesHeader.vue';
import MisPostulacionesFiltros from './MisPostulacionesFiltros.vue';
import PostulacionGrid from './PostulacionGrid.vue';

// Estado
const allPostulaciones = ref([]);
const filteredPostulaciones = ref([]);
const isLoading = ref(true);
const currentSearch = ref('');
const currentFilter = ref('');


const fetchPostulaciones = async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockData = [
    //Daniii, aca puedes hacer la integracion
    //te puse ejemplos jsjsj
    { id: 1, jobTitle: 'Frontend Developer', companyName: 'TechLab BO', location: 'Híbrido', descriptionSnippet: 'Vue.js y React para dashboards de alto rendimiento. Experiencia con APIs REST y GraphQL requerida.', daysAgo: 10, status: 'Pendiente' },
    { id: 2, jobTitle: 'Backend Engineer', companyName: 'Nexus Soft', location: 'Remoto', descriptionSnippet: 'Node.js, Python, microservicios y AWS. Buscamos alguien con pasión por la escalabilidad.', daysAgo: 5, status: 'Seleccionado' },
    { id: 3, jobTitle: 'UI/UX Designer', companyName: 'Creative Solutions', location: 'Presencial (La Paz)', descriptionSnippet: 'Figma, Adobe XD, investigación de usuarios y prototipado rápido para aplicaciones móviles.', daysAgo: 2, status: 'No seleccionado' },
  ];

  allPostulaciones.value = mockData;
  applyFilters();
  isLoading.value = false;
};

const applyFilters = () => {
  let results = allPostulaciones.value;

  // Filtro por busqueda
  if (currentSearch.value) {
    const search = currentSearch.value.toLowerCase();
    results = results.filter(p =>
      p.jobTitle.toLowerCase().includes(search) ||
      p.companyName.toLowerCase().includes(search) ||
      p.descriptionSnippet.toLowerCase().includes(search)
    );
  }

  // Filtro por estado
  if (currentFilter.value) {
    results = results.filter(p => p.status === currentFilter.value);
  }

  filteredPostulaciones.value = results;
};

const handleSearch = (query) => {
  currentSearch.value = query;
  applyFilters();
};

const handleFilter = (status) => {
  currentFilter.value = status;
  applyFilters();
};

onMounted(() => {
  fetchPostulaciones();
});
</script>
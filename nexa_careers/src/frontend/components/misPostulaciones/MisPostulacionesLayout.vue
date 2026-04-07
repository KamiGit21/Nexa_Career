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
import { obtenerPostulaciones } from '../../services/postulacionService.js';
import { authState } from '../../auth.js';

// Estado
const allPostulaciones = ref([]);
const filteredPostulaciones = ref([]);
const isLoading = ref(true);
const currentSearch = ref('');
const currentFilter = ref('');


const fetchPostulaciones = async () => {
  isLoading.value = true;
  try {
    const response = await obtenerPostulaciones(authState.id);
    if (response.success) {
      allPostulaciones.value = response.data.map(item => ({
        id: item.id_postulante,
        jobTitle: item.titulo_oferta,
        companyName: item.nombre_empleador,
        location: item.modalidad,
        descriptionSnippet: item.descripcion.length > 100 ? item.descripcion.substring(0, 100) + '...' : item.descripcion,
        daysAgo: calculateDaysAgo(item.fecha_apertura),
        status: mapStatus(item.estado_postulacion)
      }));
    } else {
      allPostulaciones.value = [];
    }
  } catch (error) {
    console.error('Error fetching postulaciones:', error);
    allPostulaciones.value = [];
  }
  applyFilters();
  isLoading.value = false;
};

const calculateDaysAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const mapStatus = (estado) => {
  switch (estado) {
    case 0: return 'Pendiente';
    case 1: return 'Seleccionado';
    case 2: return 'No seleccionado';
    default: return 'Desconocido';
  }
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
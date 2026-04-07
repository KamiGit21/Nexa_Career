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
// 1. NUEVO: Importamos el servicio para obtener los detalles de la oferta
import { obtenerOfertaPorId } from '../../services/ofertaService.js';
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
    
    if (response.success && response.data) {
      
      // 2. NUEVO: Cruzamos los datos de la postulación con los de la oferta
      const postulacionesCompletas = await Promise.all(
        response.data.map(async (postulacion) => {
          let ofertaData = {};
          
          try {
            // Buscamos la oferta usando su ID
            ofertaData = await obtenerOfertaPorId(postulacion.id_oferta);
          } catch (e) {
            console.error(`Error obteniendo detalles de la oferta ${postulacion.id_oferta}:`, e);
          }

          // Salvavidas por si la descripción viene vacía de la base de datos
          const desc = ofertaData.descripcion || '';

          return {
            // Corrección: Tu BD usa id_ofertante, no id_postulante
            id: postulacion.id_ofertante || postulacion.id, 
            jobTitle: ofertaData.titulo || 'Oferta Desconocida',
            companyName: ofertaData.empleador?.nombre || 'Empresa no disponible',
            location: ofertaData.modalidad || 'No especificada',
            descriptionSnippet: desc.length > 100 ? desc.substring(0, 100) + '...' : desc,
            daysAgo: ofertaData.fecha_apertura ? calculateDaysAgo(ofertaData.fecha_apertura) : 0,
            // Corrección: Tu BD devuelve 'estado', no 'estado_postulacion'
            status: mapStatus(postulacion.estado) 
          };
        })
      );
      
      allPostulaciones.value = postulacionesCompletas;
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
    case 1: return 'Seleccionado'; // Aceptado
    case 2: return 'No seleccionado'; // Rechazado
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
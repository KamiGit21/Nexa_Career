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
import { obtenerOfertaPorId } from '../../services/ofertaService.js';
// 1. IMPORTAMOS EL SERVICIO DEL EMPLEADOR
import { obtenerEmpleadorPorId } from '../../services/empleadorService.js';
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

    console.log("DATOS CRUDOS DEL SERVER:", response.data);
    
    if (response.success && response.data) {
      
      const postulacionesCompletas = await Promise.all(
        response.data.map(async (postulacion) => {
          let ofertaRow = {};
          let companyName = 'Empresa no disponible';
          
          try {
            // 1. Buscamos la oferta usando su ID
            const resOferta = await obtenerOfertaPorId(postulacion.id_oferta);
            if (resOferta && resOferta.success) {
              ofertaRow = resOferta.data;
            }

            // 2. Atrapamos el ID del empleador (cubriendo errores ortográficos en la BD)
            const empleadorId = ofertaRow.id_empleador || ofertaRow.id_emepleador;

            // 3. Buscamos el nombre de la empresa usando EL SERVICIO
            if (empleadorId) {
              const resEmp = await obtenerEmpleadorPorId(empleadorId);
              if (resEmp && resEmp.success && resEmp.data) {
                // Cubrimos ambas posibilidades de cómo se llame tu columna
                companyName = resEmp.data.empresa || resEmp.data.nombre || 'Empresa sin nombre';
              }
            }
          } catch (e) {
            console.error(`Error obteniendo detalles de la oferta ${postulacion.id_oferta}:`, e);
          }

          const desc = ofertaRow.descripcion ? String(ofertaRow.descripcion) : 'Sin descripción detallada.';

          return {
            id: postulacion.id_postulante || postulacion.id, 
            jobTitle: ofertaRow.oferta || 'Oferta Desconocida', 
            companyName: companyName, // AQUÍ SE ASIGNA EL NOMBRE REAL
            location: ofertaRow.modalidad || 'No especificada', 
            descriptionSnippet: desc.length > 100 ? desc.substring(0, 100) + '...' : desc,
            daysAgo: ofertaRow.fecha_apertura ? calculateDaysAgo(ofertaRow.fecha_apertura) : 0,
            status: mapStatus(postulacion.estado_postulacion)

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
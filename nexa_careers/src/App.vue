<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />

    <div :class="{ 'flex flex-1': esSupervisor }">
      
      <Sidebar v-if="esSupervisor" />

      <main :class="esSupervisor ? 'flex-1 bg-gray-100 p-6' : 'w-full'">
        <router-view />
      </main>
      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { authState } from './frontend/auth.js'; 
import Navbar from './frontend/components/layout/Navbar.vue';
import Sidebar from './frontend/components/layout/Sidebar.vue';

const route = useRoute();

const esSupervisor = computed(() => {
  const esRolSupervisor = authState.rol === 'supervisor';
  const paginasSinSidebar = ['Home', 'InicioSesion', 'RegistroEstudiante', 'RegistroEmpleador'];
  const esPaginaPublica = paginasSinSidebar.includes(route.name);
  return esRolSupervisor && !esPaginaPublica;
});
</script>

<style scoped>
* {
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}
</style>
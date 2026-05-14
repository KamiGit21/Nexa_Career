<template>
  <div class="flex flex-col min-h-screen bg-[#f8f5f0]">
    <Navbar />

    <div :class="{ 'flex flex-1': esSupervisor }">
      <Sidebar v-if="esSupervisor" />

      <main :class="esSupervisor ? 'flex-1 bg-gray-100 p-6' : 'flex-1'">
        <router-view />
        <BotonNormas />
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
import BotonNormas from './frontend/components/comunes/BotonNormas.vue';

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

#punto-final {
  height: 1px;
  margin-top: -1px;
}

body, html {
  margin: 0;
  padding: 0;
  background-color: #f8f5f0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
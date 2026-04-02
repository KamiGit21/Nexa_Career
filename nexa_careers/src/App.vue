<template>
  <div class="min-h-screen flex flex-col">
    <!-- <Navbar /> -->

    <div :class="{ 'flex flex-1': esSupervisor }">
      
      <Sidebar v-if="esSupervisor" />

      <main :class="esSupervisor ? 'flex-1 bg-gray-100 p-6' : 'w-full'">
        <router-view />
      </main>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
//import Navbar from './frontend/components/layout/Navbar.vue';
//import Sidebar from './fronten/components/layout/Sidebar.vue';

const route = useRoute();
const sesion = ref({ rol: '' });

onMounted(() => {
  sesion.value = JSON.parse(localStorage.getItem('sesion') || '{}');
});

const esSupervisor = computed(() => {
  return sesion.value.rol === 'supervisor';
});
</script>
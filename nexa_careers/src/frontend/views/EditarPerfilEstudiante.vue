<template>
  <div class="min-h-screen bg-[#1e293b] pb-12">
    <Navbar />

    <main class="max-w-4xl mx-auto mt-10 px-4">
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/10">
        
        <div class="bg-white p-8 border-b border-gray-100 text-center">
          <h1 class="text-3xl font-bold text-[#b89b4d]">Mi Perfil Profesional</h1>
          <p class="text-sm text-gray-500 mt-2">Gestiona tu información personal y académica para las postulaciones.</p>
        </div>

        <div class="p-8 md:p-12">
          <PerfilForm />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from "../components/layout/Navbar.vue";
import PerfilForm from "../components/perfilEstudiante/PerfilForm.vue";
</script>

<style scoped>
</style>
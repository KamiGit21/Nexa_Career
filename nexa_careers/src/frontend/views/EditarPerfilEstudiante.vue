<template>
  <div class="perfil-container">
    <main class="perfil-content">
      <div class="perfil-card">
        <header class="perfil-header">
          <h1>Editar Perfil de Estudiante</h1>
        </header>

        <section class="perfil-body">
          <PerfilForm />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import PerfilForm from "../components/perfilEstudiante/PerfilForm.vue";
</script>

<style src="../assets/styles/perfil-estudiante.css"></style>
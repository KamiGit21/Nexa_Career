<template>
  <div class="page">
    <Navbar />
    <div class="container">
      <PerfilForm />
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/layout/Navbar.vue";
import PerfilForm from "../components/perfilEstudiante/PerfilForm.vue";
</script>

<style scoped>
.page {
  background: #1f2f4a;
  min-height: 100vh;
}

.container {
  display: flex;
  justify-content: center;
  padding: 40px;
}
</style>
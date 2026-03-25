<template>
  <div class="registro-page">
    <Navbar />
    <div class="registro-container">
      <RegistroForm />
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/layout/Navbar.vue";
import RegistroForm from "../components/registroEmpleador/RegistroForm.vue";
</script>

<style scoped>
.registro-page {
  background: #1f2f4a;
  min-height: 100vh;
}

.registro-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
<template>
  <div class="page">
    <Navbar />

    <div class="container">
      <PerfilEmpleadorForm />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import PerfilEmpleadorForm from "@/components/perfilEmpleador/PerfilEmpleadorForm.vue";
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
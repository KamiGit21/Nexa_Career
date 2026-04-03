<template>
  <div class="min-h-screen bg-[#1e293b] pb-12">
    <main class="max-w-6xl mx-auto mt-10 px-6">

      <div class="bg-slate-50/5 rounded-3xl p-1 backdrop-blur-sm border border-white/5">
        <PerfilEmpleadorForm />
      </div>
    </main>
  </div>
</template>

<script setup>
import PerfilEmpleadorForm from "@/components/perfilEmpleador/PerfilEmpleadorForm.vue";
</script>
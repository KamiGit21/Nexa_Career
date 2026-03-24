<template>
  <section class="jobs">
    <h2>Algunas Ofertas Laborales:</h2>

    <div class="grid">
      <JobCard v-for="job in jobs" :key="job.title" :job="job" />
    </div>
  </section>
</template>

<script setup>
import JobCard from './JobCard.vue'

const jobs = [
  {
    title: "Analista Financiero",
    company: "Eventos Chuno",
    categories: ["Finanzas"]
  },
  {
    title: "Programador Junior Java",
    company: "Asuresoft",
    categories: ["Sistemas", "Java"]
  }
];
</script>

<style scoped>
.jobs {
  padding: 40px;
  background: #eae1d4;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>
<template>
  <div class="job-card">
    <h3>{{ job.title }}</h3>
    <p>Empresa: {{ job.company }}</p>

    <ul>
      <li v-for="cat in job.categories" :key="cat">{{ cat }}</li>
    </ul>

    <button>Ver más</button>
  </div>
</template>

<script setup>
defineProps({
  job: Object
});
</script>

<style scoped>
.job-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

button {
  background: #0d2b4d;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
}
</style>
<template>
  <section class="categories">
    <h2>Busca por Categoría:</h2>

    <div class="grid">
      <div class="card" v-for="cat in categories" :key="cat">
        {{ cat }}
      </div>
    </div>
  </section>
</template>

<script setup>
const categories = [
  "Medicina y salud",
  "Tecnología",
  "Comunicación social",
  "Economía y finanzas",
  "Logística y operaciones",
  "Audiovisual",
  "Redes",
  "Química y biomédica"
];
</script>

<style scoped>
.categories {
  padding: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.card {
  background: #c5d3df;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}
</style>
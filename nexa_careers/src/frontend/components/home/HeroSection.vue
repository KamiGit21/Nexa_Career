<script setup>
import heroImg from '@/assets/images/hero.png'
</script>


<template>
  <section class="hero">
    <div class="left">
      <h1>¡Empieza a adquirir experiencia ya!</h1>
      <p>
        Busca tu oportunidad de carrera entre más de 1200 puestos que tenemos
      </p>

      <div class="stats">
        <div>
          <h2>+1235</h2>
          <span>Estudiantes registrados</span>
        </div>
        <div>
          <h2>+156</h2>
          <span>Empresas aliadas</span>
        </div>
        <div>
          <h2>+820</h2>
          <span>Entrevistas conseguidas</span>
        </div>
      </div>
    </div>

    <img :src="heroImg" alt="hero" />
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  padding: 50px;
}

.left {
  max-width: 500px;
}

.stats {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}
</style>
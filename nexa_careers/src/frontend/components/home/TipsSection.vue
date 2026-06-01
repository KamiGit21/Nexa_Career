<template>
  <section class="tips-section">
    <h2>Consejos para conseguir una entrevista</h2>
    <p class="tips-subtitle">Aplica estas estrategias y aumenta tus probabilidades de ser llamado.</p>

    <div class="carousel-wrapper">
      <button class="arrow" @click="prev">&#8592;</button>

      <div class="carousel-track" ref="track">
        <TipCard v-for="(tip, i) in tips" :key="i" :tip="tip" />
      </div>

      <button class="arrow" @click="next">&#8594;</button>
    </div>

    <div class="dots">
      <span
        v-for="(_, i) in tips" :key="i"
        class="dot"
        :class="{ active: i === current }"
        @click="goTo(i)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TipCard from './TipCard.vue'

const current = ref(0)
const track = ref(null)

const tips = [
  { icon: '📄', title: 'Personaliza tu CV', description: 'Adapta tu CV a cada oferta usando las palabras clave del puesto.' },
  { icon: '👤', title: 'Completa tu perfil', description: 'Un perfil con foto, habilidades y experiencia genera más confianza.' },
  { icon: '⚡', title: 'Aplica rápido', description: 'Las primeras postulaciones tienen mayor visibilidad ante el reclutador.' },
  { icon: '📊', title: 'Usa números', description: '"Aumenté ventas un 30%" impacta más que "mejoré las ventas".' },
  { icon: '✉️', title: 'Carta personalizada', description: 'Una carta breve y enfocada en el empleador marca la diferencia.' },
  { icon: '🔄', title: 'Mantén tu perfil activo', description: 'Actualiza tu perfil regularmente para aparecer en más búsquedas.' },
  {icon: '🔗', title:'Conecta en LinkedIn', description:'Agrega al reclutador o a empleados de la empresa antes de postular.'},
  {icon: '🎯', title:'Investiga la empresa', description:'Conocer su misión y valores te da ventaja en la entrevista.'},
  {icon: '💬', title:'Practica tus respuestas', description:'Ensaya preguntas frecuentes como "¿cuál es tu mayor fortaleza?" en voz alta.'},
  {icon: '🏆', title:'Destaca proyectos reales', description:'Un proyecto propio o académico demuestra iniciativa más que solo listar cursos.'},
  {icon: '📬', title:'Haz seguimiento', description:'Si no recibes respuesta en una semana, envía un mensaje breve de seguimiento.'},
  {icon: '🕐', title:'Postula en horario laboral', description:'Las postulaciones enviadas en horario de oficina tienen más probabilidad de ser vistas.'},
  {icon: '🧹', title:'Limpia tus redes sociales', description:'Los reclutadores revisan tu perfil público — asegúrate de que sea profesional.'},
  {icon: '📚', title:'Toma cursos relevantes', description:'Certifícate en habilidades del puesto antes de postular para reforzar tu CV.'},
  {icon: '🤝', title:'Pide referencias', description:'Una recomendación de un profesor o jefe anterior pesa mucho en el proceso.'},
  {icon: '✅', title:'Sin errores ortográficos', description:'Un CV con faltas de ortografía se descarta automáticamente en muchas empresas.'},
]

const cardWidth = 316 // 300px card + 16px gap

const goTo = (i) => {
  current.value = i
  track.value.scrollTo({ left: i * cardWidth, behavior: 'smooth' })
}

const next = () => goTo(Math.min(current.value + 1, tips.length - 1))
const prev = () => goTo(Math.max(current.value - 1, 0))
</script>

<style scoped>
.tips-section {
  padding: 60px 40px;
  background: #f5f7fa;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1b2a4a;
  margin-bottom: 8px;
}

.tips-subtitle {
  color: #666;
  margin-bottom: 32px;
  font-size: 0.95rem;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.carousel-track {
  display: flex;
  gap: 16px;
  overflow: hidden;
  width: 948px; /* muestra 3 tarjetas */
  scroll-snap-type: x mandatory;
}

.arrow {
  background: #1b2a4a;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.arrow:hover { background: #b5943a; }

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active { background: #b5943a; }
</style>
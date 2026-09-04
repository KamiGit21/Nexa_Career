<template>
  <div class="tip-card">
    <div class="tip-icon">{{ tip.icon }}</div>
    <h3>{{ tip.title }}</h3>
    <p>{{ tip.description }}</p>
  </div>
</template>

<script setup>
defineProps({
  tip: { type: Object, required: true }
})
</script>

<style scoped>
.tip-card {
  background: white;
  border-radius: 16px;
  padding: 28px 24px;
  border-top: 4px solid #b5943a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 260px;
  max-width: 300px;
  flex-shrink: 0;
}

.tip-icon {
  font-size: 2rem;
}

h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1b2a4a;
  margin: 0;
}

p {
  font-size: 0.875rem;
  color: #555;
  margin: 0;
  line-height: 1.5;
}
</style>
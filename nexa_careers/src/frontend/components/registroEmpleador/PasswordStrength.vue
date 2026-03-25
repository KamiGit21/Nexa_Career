<template>
  <div class="strength">
    <div class="bar" :style="{ width: strength + '%' }"></div>
    <p>{{ label }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  password: String
});

const strength = computed(() => {
  let score = 0;
  if (props.password.length > 6) score += 25;
  if (/[A-Z]/.test(props.password)) score += 25;
  if (/[0-9]/.test(props.password)) score += 25;
  if (/[^A-Za-z0-9]/.test(props.password)) score += 25;
  return score;
});

const label = computed(() => {
  if (strength.value < 50) return "Débil";
  if (strength.value < 75) return "Media";
  return "Fuerte";
});
</script>
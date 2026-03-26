<template>
  <div v-if="visible" class="overlay">
    <div class="modal">
      <h2 :class="type">{{ title }}</h2>
      <p>{{ message }}</p>

      <div class="actions">
        <button @click="$emit('close')">Cerrar</button>
        <button @click="$emit('action')">{{ actionText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
  message: String,
  actionText: String,
  type: String
});
</script>
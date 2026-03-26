<template>
  <div class="overlay" v-if="visible">
    <div class="modal">
      <h2 :class="type">{{ title }}</h2>
      <p>{{ message }}</p>

      <div class="actions">
        <button class="secondary" @click="$emit('close')">
          Volver a Inicio
        </button>

        <button class="primary" @click="$emit('action')">
          {{ actionText }}
        </button>
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
  type: String // success | error
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #f5f5f5;
  padding: 25px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
}

.success {
  color: green;
}

.error {
  color: red;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.primary {
  background: #1f2f4a;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
}

.secondary {
  background: #ccc;
  padding: 8px 16px;
  border-radius: 8px;
}
</style>
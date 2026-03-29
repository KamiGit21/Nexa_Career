<template>
  <div class="actions">
    <button class="save" @click="$emit('save')" :disabled="loading">
      {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
    </button>

    <button class="cancel" @click="$router.back()">
      Cancelar
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

defineProps({
  loading: Boolean
});

defineEmits(['save']);
</script>

<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.save {
  background: var(--primary);
  color: white;
  padding: 14px 30px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel {
  color: var(--accent);
  border-bottom: 2px solid var(--accent);
  cursor: pointer;
  background: none;
  border: none;
  padding: 14px 30px;
}
</style>
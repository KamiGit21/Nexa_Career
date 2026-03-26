<template>
  <div class="actions">
    <button class="save" @click="$emit('save')">
      Guardar Cambios
    </button>

    <button class="cancel">
      Cancelar
    </button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save {
  background: var(--primary);
  color: white;
  padding: 14px 30px;
  border-radius: 12px;
  font-weight: bold;
}

.cancel {
  color: var(--accent);
  border-bottom: 2px solid var(--accent);
  cursor: pointer;
}
</style>
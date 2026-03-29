<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option value="">Seleccionar sector...</option>
      <option value="Tecnología">Tecnología</option>
      <option value="Finanzas">Finanzas</option>
      <option value="Salud">Salud</option>
      <option value="Educación">Educación</option>
      <option value="Consultoría">Consultoría</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: String
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.input-group {
  margin-bottom: 16px;
}

label {
  font-size: 13px;
  margin-bottom: 6px;
  display: block;
}

select {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--input-bg);
}
</style>
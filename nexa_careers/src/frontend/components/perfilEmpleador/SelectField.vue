<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <select>
      <option>Seleccionar sector...</option>
      <option>Tecnología</option>
      <option>Finanzas</option>
      <option>Salud</option>
    </select>
  </div>
</template>

<script setup>
defineProps({ label: String });
</script>

<style scoped>
select {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--input-bg);
}
</style>
<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <select>
      <option>Seleccionar sector...</option>
      <option>Tecnología</option>
      <option>Finanzas</option>
    </select>
  </div>
</template>

<script setup>
defineProps({ label: String });
</script>
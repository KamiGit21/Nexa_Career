<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <textarea 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      maxlength="500"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: String  // ← Agregar esta línea
});

defineEmits(['update:modelValue']);  // ← Agregar esta línea
</script>
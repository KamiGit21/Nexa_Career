<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <input 
      :type="type" 
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: "text"
  },
  modelValue: [String, Number]  // ← Agregar esta línea
});

defineEmits(['update:modelValue']);  // ← Agregar esta línea
</script>
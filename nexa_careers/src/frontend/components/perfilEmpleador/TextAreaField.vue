<template>
  <div>
    <label>{{ label }}</label>

    <textarea 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      maxlength="300"
    ></textarea>

    <div class="counter">{{ (modelValue || '').length }} / 300</div>
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
textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  min-height: 110px;
  background: var(--input-bg);
  resize: vertical;
}

.counter {
  text-align: right;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}
</style>
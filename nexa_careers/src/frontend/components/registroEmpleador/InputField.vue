<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <input :type="type" :placeholder="placeholder" />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: "text"
  }
});
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>
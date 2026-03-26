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
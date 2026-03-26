<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <textarea maxlength="300"></textarea>
  </div>
</template>

<script setup>
defineProps({
  label: String
});
</script>
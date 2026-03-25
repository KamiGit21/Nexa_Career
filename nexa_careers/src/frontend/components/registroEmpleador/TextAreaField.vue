<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <textarea maxlength="300"></textarea>
    <small>0 / 300</small>
  </div>
</template>

<script setup>
defineProps({ label: String });
</script>
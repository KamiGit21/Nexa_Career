<template>
  <div class="toggle">
    <label>{{ label }}</label>
    <input type="checkbox" v-model="value" />
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({ label: String });
const value = ref(true);
</script>
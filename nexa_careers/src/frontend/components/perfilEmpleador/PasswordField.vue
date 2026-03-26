<template>
  <div>
    <label>{{ label }}</label>
    <input type="password" v-model="password" />
    <PasswordStrength :password="password" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PasswordStrength from "./PasswordStrength.vue";

defineProps({ label: String });

const password = ref("");
</script>
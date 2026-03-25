<template>
  <div>
    <div class="input-group">
      <label>Contraseña</label>
      <input type="password" v-model="password" />
    </div>

    <PasswordStrength :password="password" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PasswordStrength from "./PasswordStrength.vue";

const password = ref("");
</script>
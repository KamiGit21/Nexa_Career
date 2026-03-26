<template>
  <div>
    <label>Contraseña</label>
    <input type="password" v-model="password" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const password = ref("");
</script>
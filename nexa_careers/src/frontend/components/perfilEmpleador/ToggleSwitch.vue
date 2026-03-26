<template>
  <div class="toggle">
    <span>{{ label }}</span>
    <div class="switch" :class="{ active: value }" @click="value = !value"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
defineProps({ label: String });
const value = ref(true);
</script>

<style scoped>
.switch {
  width: 52px;
  height: 26px;
  background: #ddd;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
}

.switch::after {
  content: "";
  width: 22px;
  height: 22px;
  background: white;
  position: absolute;
  top: 2px;
  left: 3px;
  border-radius: 50%;
  transition: 0.3s;
}

.switch.active {
  background: var(--primary);
}

.switch.active::after {
  left: 26px;
}
</style>
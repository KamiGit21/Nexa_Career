<template>
  <div class="toggle">
    <span>{{ label }}</span>
    <div class="switch" :class="{ active: modelValue }" @click="$emit('update:modelValue', !modelValue)"></div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: Boolean
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

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
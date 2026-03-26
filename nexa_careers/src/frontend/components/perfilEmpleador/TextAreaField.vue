<template>
  <div>
    <label>{{ label }}</label>

    <textarea v-model="text" maxlength="300"></textarea>

    <div class="counter">{{ text.length }} / 300</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
defineProps({ label: String });

const text = ref("");
</script>

<style scoped>
textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  min-height: 110px;
  background: var(--input-bg);
}

.counter {
  text-align: right;
  font-size: 11px;
  color: #999;
}
</style>
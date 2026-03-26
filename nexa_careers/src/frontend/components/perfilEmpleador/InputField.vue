<template>
  <div class="input-group">
    <label>{{ label }}</label>

    <div class="input-wrapper">
      <span class="icon">{{ icon }}</span>

      <input 
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  placeholder: String,
  icon: String,
  type: { default: "text" },
  disabled: Boolean
});
</script>

<style scoped>
.input-group {
  margin-bottom: 16px;
}

label {
  font-size: 13px;
  margin-bottom: 6px;
  display: block;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--input-bg);
  padding: 10px;
}

.icon {
  margin-right: 8px;
  color: #888;
}

input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
}
</style>
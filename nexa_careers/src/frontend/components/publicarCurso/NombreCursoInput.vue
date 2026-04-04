<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Nombre del curso <span class="text-red-500">*</span>
    </label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      maxlength="255"
      placeholder="Ej. Introducción a Vue.js, Diseño UX desde cero..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#f8fafc]
             focus:border-[#1b2a4a] focus:ring-2 focus:ring-[#1b2a4a]/10
             outline-none transition text-sm"
    />
    <p class="text-right text-xs text-gray-400 mt-1">
      {{ (modelValue || '').length }} / 255
    </p>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: '' } })
defineEmits(['update:modelValue'])
</script>
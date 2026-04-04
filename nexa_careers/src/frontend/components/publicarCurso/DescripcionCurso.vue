<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Descripción <span class="text-red-500">*</span>
    </label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="5"
      maxlength="1000"
      placeholder="Describe el contenido del curso, sus objetivos y a quién va dirigido..."
      class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#f8fafc]
             focus:border-[#1b2a4a] focus:ring-2 focus:ring-[#1b2a4a]/10
             outline-none transition resize-none text-sm"
    ></textarea>
    <p class="text-right text-xs text-gray-400 mt-1">
      {{ (modelValue || '').length }} / 1000
    </p>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: '' } })
defineEmits(['update:modelValue'])
</script>
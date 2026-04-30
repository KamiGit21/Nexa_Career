<template>
  <div class="relative mb-5">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Buscar categoría..."
      class="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
             bg-white focus:outline-none focus:border-[#1e293b] transition-colors"
    />
    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
      🔍
    </span>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: '' } })
defineEmits(['update:modelValue'])
</script>
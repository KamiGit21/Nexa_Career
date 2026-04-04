<template>
  <div 
    class="bg-white p-6 rounded-xl border-l-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
    :style="{ borderLeftColor: color }"
  >
    <div>
      <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">{{ label }}</p>
      <div class="flex items-end gap-2 mt-2">
        <span class="text-3xl font-bold text-slate-800">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  value: [Number, String],
  color: String,
});

const getIconUrl = (name) => {
  return new URL(`../../assets/images/${name}`, import.meta.url).href;
};
</script>
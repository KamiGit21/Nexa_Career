<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600 w-12">Desde</span>
      <input
        type="date"
        :value="desde"
        @change="$emit('update:desde', $event.target.value)"
        class="flex-1 px-3 py-1.5 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] bg-white cursor-pointer"
      />
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600 w-12">Hasta</span>
      <input
        type="date"
        :value="hasta"
        :min="desde || undefined"
        @change="$emit('update:hasta', $event.target.value)"
        class="flex-1 px-3 py-1.5 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] bg-white cursor-pointer"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  desde: { type: String, default: '' },
  hasta: { type: String, default: '' }
})
defineEmits(['update:desde', 'update:hasta'])
</script>
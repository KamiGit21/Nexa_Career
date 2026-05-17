<template>
  <div class="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
    <p class="text-xs font-bold text-red-700 flex items-center gap-1">
      ✕ Motivo de rechazo
    </p>
    <p class="text-sm text-red-600 leading-relaxed">
      {{ motivo || 'No se especificó un motivo.' }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  motivo: { type: String, default: '' }
})
</script>
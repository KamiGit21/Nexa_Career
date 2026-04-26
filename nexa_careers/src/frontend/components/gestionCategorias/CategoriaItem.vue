<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white rounded-xl
              border border-gray-100 hover:border-gray-200 transition-colors">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-[#1e293b]/8 flex items-center justify-center
                  text-[#1e293b] text-sm font-bold select-none">
        {{ categoria.categoria?.charAt(0).toUpperCase() }}
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-700">{{ categoria.categoria }}</p>
        <p class="text-xs text-slate-400">
          Usada en {{ categoria.total_ofertas ?? 0 }} ofertas
          · {{ categoria.total_cursos ?? 0 }} cursos
        </p>
      </div>
    </div>

    <button
      @click="$emit('eliminar', categoria)"
      class="text-xs text-red-500 font-medium hover:text-red-700 transition-colors px-2 py-1"
    >
      Eliminar
    </button>
  </div>
</template>

<script setup>
defineProps({ categoria: { type: Object, required: true } })
defineEmits(['eliminar'])
</script>
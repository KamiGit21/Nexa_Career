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
        <div class="flex items-center gap-2 mt-0.5">
          <span
            :class="categoria.total_ofertas > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-400'"
            class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          >
            {{ categoria.total_ofertas > 0 ? `✓ ${categoria.total_ofertas} ofertas` : 'Sin ofertas' }}
          </span>
          <span class="text-[10px] text-slate-400">· {{ categoria.total_cursos ?? 0 }} cursos</span>
        </div>
      </div>
    </div>

    <button
      @click="$emit('editar', categoria)"
      class="text-xs text-[#1e293b] font-semibold hover:text-[#b5943a] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1e293b]/5"
    >
      ✏️ Editar
    </button>
  </div>
</template>

<script setup>
defineProps({ categoria: { type: Object, required: true } })
defineEmits(['editar'])
</script>
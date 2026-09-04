<template>
  <div :class="[
    'flex items-center justify-between px-4 py-3 rounded-xl border transition-colors',
    archivada
      ? 'bg-slate-50 border-slate-200 opacity-70'
      : 'bg-white border-gray-100 hover:border-gray-200'
  ]">
    <div class="flex items-center gap-3">
      <div :class="[
        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold select-none',
        archivada ? 'bg-slate-200 text-slate-400' : 'bg-[#1e293b]/8 text-[#1e293b]'
      ]">
        {{ categoria.categoria?.charAt(0).toUpperCase() }}
      </div>
      <div>
        <div class="flex items-center gap-2">
          <p :class="['text-sm font-semibold', archivada ? 'text-slate-400 line-through' : 'text-slate-700']">
            {{ categoria.categoria }}
          </p>
          <span v-if="archivada" class="text-[10px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            Archivada
          </span>
        </div>
        <p class="text-xs text-slate-400">
          Usada en {{ categoria.total_ofertas ?? 0 }} ofertas
          · {{ categoria.total_cursos ?? 0 }} cursos
        </p>
        <p class="text-sm font-semibold text-slate-700">{{ categoria.categoria }}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <span :class="categoria.total_ofertas > 0
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-400'" class="text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {{ categoria.total_ofertas > 0 ? `✓ ${categoria.total_ofertas} ofertas` : 'Sin ofertas' }}
          </span>
          <span class="text-[10px] text-slate-400">· {{ categoria.total_cursos ?? 0 }} cursos</span>
        </div>
      </div>
    </div>

    <button @click="$emit(archivada ? 'desarchivar' : 'archivar', categoria)" :class="[
      'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
      archivada
        ? 'text-green-600 bg-green-50 hover:bg-green-100'
        : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
    ]">
      {{ archivada ? 'Desarchivar' : 'Archivar' }}
    </button>
    <button @click="$emit('editar', categoria)" type="button"
      class="text-xs text-[#1e293b] font-semibold hover:text-[#b5943a] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1e293b]/5">
      ✏️ Editar
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categoria: { type: Object, required: true },
})

defineEmits(['archivar', 'desarchivar', 'editar'])

const archivada = computed(() => props.categoria.estado === 0)
</script>
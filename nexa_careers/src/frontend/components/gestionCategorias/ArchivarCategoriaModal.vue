<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="$emit('cancelar')"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-bold text-slate-800 mb-2">
          {{ esArchivar ? 'Archivar categoría' : 'Desarchivar categoría' }}
        </h2>

        <p class="text-sm text-slate-500 mb-1">
          {{ esArchivar
            ? '¿Estás seguro de que deseas archivar la categoría'
            : '¿Estás seguro de que deseas desarchivar la categoría'
          }}
          <span class="font-semibold text-slate-700">"{{ categoria?.categoria }}"</span>?
        </p>

        <p v-if="esArchivar" class="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-3">
          La categoría dejará de aparecer en la selección de nuevas ofertas y cursos,
          pero las asociaciones existentes se conservarán.
        </p>
        <p v-else class="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mt-3">
          La categoría volverá a estar disponible para nuevas ofertas y cursos.
        </p>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="$emit('cancelar')"
            class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirmar', categoria)"
            :disabled="procesando"
            :class="esArchivar
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-green-600 hover:bg-green-700'"
            class="px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-60"
          >
            <span v-if="procesando">Procesando...</span>
            <span v-else>{{ esArchivar ? 'Sí, archivar' : 'Sí, desarchivar' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  visible:    { type: Boolean, default: false },
  categoria:  { type: Object,  default: null },
  esArchivar: { type: Boolean, default: true },
  procesando: { type: Boolean, default: false },
})
defineEmits(['cancelar', 'confirmar'])
</script>
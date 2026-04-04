<template>
  <div class="flex gap-4 pt-2">
    <button
      type="submit"
      :disabled="cargando"
      class="flex-1 py-3 bg-[#1b2a4a] text-white font-semibold rounded-xl
             hover:bg-[#0f1a2e] disabled:opacity-50 transition"
    >
      {{ cargando ? 'Publicando...' : 'Publicar Curso' }}
    </button>
    <button
      type="button"
      @click="$router.back()"
      class="px-8 py-3 border border-gray-300 rounded-xl
             hover:bg-gray-100 transition text-gray-700"
    >
      Cancelar
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({ cargando: { type: Boolean, default: false } })
const router = useRouter()
</script>
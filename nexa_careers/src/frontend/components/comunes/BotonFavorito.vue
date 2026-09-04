<template>
  <button
    @click.stop="emit('toggle')"
    :title="activo ? 'Quitar de favoritos' : 'Guardar en favoritos'"
    class="rounded-full p-1 transition-all focus:outline-none"
    :class="activo ? 'text-red-500 hover:text-red-700' : 'text-gray-300 hover:text-red-400'"
  >
    <span :class="tamanoClase">{{ activo ? '❤️' : '🤍' }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activo: { type: Boolean, default: false },
  tamano: { type: String,  default: 'md'  }
})

const emit = defineEmits(['toggle'])

const TAMANOS = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }
const tamanoClase = computed(() => TAMANOS[props.tamano] ?? TAMANOS.md)
</script>
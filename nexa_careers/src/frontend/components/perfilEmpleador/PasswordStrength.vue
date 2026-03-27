<template>
  <div v-if="password" class="mt-2">
    <!-- Barras de fortaleza -->
    <div class="flex gap-1.5 mb-1.5">
      <div
        v-for="i in 4"
        :key="i"
        class="h-1.5 flex-1 rounded-full transition-all duration-300"
        :class="barClass(i)"
      />
    </div>

    <!-- Texto de fortaleza -->
    <p class="text-xs font-medium transition-colors duration-300" :class="textClass">
      {{ label }}
    </p>

    <!-- Requisitos -->
    <ul class="mt-2 space-y-1">
      <li
        v-for="req in requirements"
        :key="req.label"
        class="flex items-center gap-1.5 text-xs transition-colors duration-200"
        :class="req.met ? 'text-green-600' : 'text-gray-400'"
      >
        <svg
          v-if="req.met"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5 shrink-0 text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <circle cx="10" cy="10" r="4" />
        </svg>
        {{ req.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  password: string
}>()

const requirements = computed(() => [
  { label: 'Mínimo 8 caracteres',          met: props.password.length >= 8 },
  { label: 'Al menos una letra mayúscula',  met: /[A-Z]/.test(props.password) },
  { label: 'Al menos una letra minúscula',  met: /[a-z]/.test(props.password) },
  { label: 'Al menos un número',            met: /\d/.test(props.password) },
  { label: 'Al menos un carácter especial', met: /[^A-Za-z0-9]/.test(props.password) },
])

const strength = computed(() => requirements.value.filter(r => r.met).length)

const label = computed(() => {
  if (strength.value <= 1) return 'Muy débil'
  if (strength.value === 2) return 'Débil'
  if (strength.value === 3) return 'Aceptable'
  if (strength.value === 4) return 'Fuerte'
  return 'Muy fuerte'
})

const textClass = computed(() => {
  if (strength.value <= 1) return 'text-red-500'
  if (strength.value === 2) return 'text-orange-500'
  if (strength.value === 3) return 'text-yellow-500'
  if (strength.value === 4) return 'text-blue-500'
  return 'text-green-600'
})

function barClass(index: number) {
  const filled = index <= strength.value
  if (!filled) return 'bg-gray-200'
  if (strength.value <= 1) return 'bg-red-400'
  if (strength.value === 2) return 'bg-orange-400'
  if (strength.value === 3) return 'bg-yellow-400'
  if (strength.value === 4) return 'bg-blue-500'
  return 'bg-green-500'
}
</script>
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Contacto <span class="text-red-500">*</span>
    </label>
    <div class="flex gap-2">
      <input
        v-model="entrada"
        @keydown.enter.prevent="agregar"
        type="text"
        placeholder="Correo, teléfono, WhatsApp o enlace..."
        class="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-[#f8fafc]
               focus:border-[#1b2a4a] outline-none transition text-sm"
      />
      <button
        type="button"
        @click="agregar"
        class="px-4 py-3 bg-[#1b2a4a] text-white rounded-xl hover:bg-[#0f1a2e]
               transition font-bold text-lg leading-none"
      >+</button>
    </div>

    <div v-if="chips.length" class="flex flex-wrap gap-2 mt-3">
      <span
        v-for="(chip, i) in chips"
        :key="i"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b2a4a]/10
               text-[#1b2a4a] rounded-full text-xs font-medium"
      >
        <span>{{ iconoPor(chip) }}</span>
        <span>{{ chip }}</span>
        <button type="button" @click="quitar(i)"
                class="text-gray-400 hover:text-red-500 ml-1 font-bold">×</button>
      </span>
    </div>
    <p v-else class="text-xs text-gray-400 mt-2">
      Presiona Enter o + para agregar un dato de contacto.
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const entrada = ref('')
const chips = ref(
  props.modelValue ? props.modelValue.split(' | ').filter(Boolean) : []
)

const iconoPor = (val) => {
  if (/^\+?\d[\d\s\-]{5,}$/.test(val)) return '📞'
  if (/@/.test(val) && !/http/i.test(val)) return '✉️'
  if (/wa\.me|whatsapp/i.test(val)) return '💬'
  if (/linkedin/i.test(val)) return '🔗'
  return '🌐'
}

const agregar = () => {
  const v = entrada.value.trim()
  if (v && !chips.value.includes(v)) {
    chips.value.push(v)
    entrada.value = ''
    emit('update:modelValue', chips.value.join(' | '))
  }
}

const quitar = (i) => {
  chips.value.splice(i, 1)
  emit('update:modelValue', chips.value.join(' | '))
}

watch(() => props.modelValue, (val) => {
  chips.value = val ? val.split(' | ').filter(Boolean) : []
})
</script>
<template>
  <div class="w-full">
    <!-- Estado 1: Sin archivo -->
    <div 
      v-if="!cvActual"
      class="border-2 border-dashed border-[#002349] rounded-[15px] bg-[#FAFAF8] p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#b5943a] transition-colors"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-[#b5943a] bg-[#fff8ec]': isDragging }"
    >
      <svg class="w-12 h-12 text-[#002349]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      <p class="text-[#002349] font-semibold text-center">Arrastra tu CV aquí o haz clic para seleccionar</p>
      <p class="text-xs text-gray-400">PDF o DOC/DOCX · Máx. 5 MB</p>
    </div>

    <!-- Estado 2: Archivo cargado -->
    <div 
      v-else
      class="border border-[#002349] rounded-[15px] bg-[#FAFAF8] p-6 flex items-center gap-4"
    >
      <div class="text-4xl">📄</div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-[#002349] truncate">{{ cvActual.name }}</p>
        <p class="text-xs text-green-600 mt-0.5">✓ Archivo cargado correctamente</p>
      </div>
      <button 
        @click="removeFile" 
        class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        Eliminar
      </button>
    </div>

    <!-- Input oculto -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".pdf,.doc,.docx" 
      class="hidden" 
      @change="handleFileChange" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:cv'])

const fileInput = ref(null)
const cvActual = ref(null)
const isDragging = ref(false)

// Abrir selector de archivos
const triggerFileInput = () => {
  fileInput.value.click()
}

// Procesar archivo seleccionado
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
  e.target.value = '' // Limpiar para poder seleccionar el mismo archivo nuevamente
}

// Procesar archivo arrastrado
const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

// Validación y procesamiento del archivo
const processFile = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (!allowedTypes.includes(file.type)) {
    alert('Solo se permiten archivos PDF o Word (DOC/DOCX)')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo no puede superar los 5 MB')
    return
  }

  cvActual.value = file
  emit('update:cv', file)
}

// Eliminar archivo
const removeFile = () => {
  cvActual.value = null
  emit('update:cv', null)
}
</script>
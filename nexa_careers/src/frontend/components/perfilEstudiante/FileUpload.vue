<template>
  <div class="drop-zone" :class="{ 'drop-zone--active': isDragging }" @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
    <div class="drop-zone__content">
      <div class="icon-cv">📄</div>
      <p class="drop-text">
        {{ fileName || 'Arrastre su archivo PDF aquí o' }}
      </p>
      <input type="file" id="cv-upload" hidden accept=".pdf" @change="handleFileSelect" />
      <label for="cv-upload" class="btn-select">Seleccione su archivo</label>
    </div>
    <div class="clip-icon">🖇️</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isDragging = ref(false);
const fileName = ref('');
const fileInput = ref(null);
const emit = defineEmits(['file-uploaded', 'file-removed']);

// Funcion para limpiar el archivo
const clear = () => {
  fileName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

defineExpose({ clear });

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  processFile(file);
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  processFile(file);
};

const processFile = (file) => {
  if (file && file.type === 'application/pdf') {
    fileName.value = file.name;
    emit('file-uploaded', file);
  } else {
    alert("Por favor, sube solo archivos PDF.");
  }
};
</script>
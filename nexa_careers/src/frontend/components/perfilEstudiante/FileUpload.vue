<template>
  <div class="upload-wrapper">
    <div class="drop-zone" :class="{
      'drop-zone--active': isDragging,
      'drop-zone--success': status === 'success',
      'drop-zone--error': status === 'error'
    }" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
      <div class="drop-zone__content">
        <div class="icon-cv">📄</div>
        <p class="drop-text">
          {{ fileName || 'Arrastre su archivo PDF aquí o' }}
        </p>
        <input type="file" ref="fileInput" id="cv-upload" hidden accept=".pdf" @change="handleFileSelect" />
        <label for="cv-upload" class="btn-select">Seleccione su archivo</label>
      </div>
      <div class="clip-icon">🖇️</div>
    </div>
    <Transition name="fade">
      <div v-if="status" :class="['feedback-msg', `msg-${status}`]">
        <span v-if="status === 'success'">✅ Archivo cargado correctamente</span>
        <span v-else>❌ Error: Solo se permiten archivos PDF</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isDragging = ref(false);
const fileName = ref('');
const fileInput = ref(null);
const status = ref(null);
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
    status.value = 'success';
    emit('file-uploaded', file);
  } else {
    status.value = 'error';
    fileName.value = '';
    // Limpiar el error luego de 3 seg
    setTimeout(() => { status.value = null; }, 3000);
  }
};
</script>
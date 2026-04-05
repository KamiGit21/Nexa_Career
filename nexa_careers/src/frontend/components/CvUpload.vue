<template>
  <div class="w-full">
    <div v-if="!cvUrl && !cargando" 
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
      <p class="text-xs text-gray-400">PDF · Máx. 5 MB</p>
    </div>

    <div v-else-if="cargando" class="text-center p-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#002349]"></div>
      <p class="mt-2 text-[#002349]">Subiendo CV...</p>
    </div>

    <div v-else class="border border-[#002349] rounded-[15px] bg-[#FAFAF8] p-6 flex items-center gap-4">
      <div class="text-4xl">📄</div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-[#002349] truncate">{{ nombreCV }}</p>
        <p class="text-xs text-green-600 mt-0.5">✓ CV cargado correctamente</p>
        <div class="flex gap-3 mt-2">
          <a :href="cvUrl" target="_blank" class="text-xs text-blue-600 hover:underline">Ver CV</a>
          <button @click="eliminar" class="text-xs text-red-600 hover:underline">Eliminar</button>
        </div>
      </div>
    </div>

    <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="handleFileChange" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { subirCV, obtenerInfoCV, eliminarCV } from '../services/estudianteService.js'

// ✅ Cambiar el tipo para aceptar String o Number
const props = defineProps({
  idEstudiante: {
    type: [Number, String],  // Acepta ambos tipos
    required: true
  }
})

// Convertir a número para usarlo en las peticiones
const idEstudianteNum = computed(() => Number(props.idEstudiante))

console.log('CvUpload - ID recibido:', props.idEstudiante)
console.log('CvUpload - ID convertido a número:', idEstudianteNum.value)

const emit = defineEmits(['update:cv', 'cv-subido', 'cv-eliminado'])

const fileInput = ref(null)
const isDragging = ref(false)
const cargando = ref(false)
const cvUrl = ref(null)
const nombreCV = ref('')

const cargarInfoCV = async () => {
  try {
    const response = await obtenerInfoCV(idEstudianteNum.value)
    if (response.success && response.hasCV) {
      cvUrl.value = `http://localhost:3000/api/estudiantes/${idEstudianteNum.value}/cv/ver`
      nombreCV.value = response.data.filename
    } else {
      cvUrl.value = null
      nombreCV.value = ''
    }
  } catch (error) {
    console.error('Error al cargar info del CV:', error)
  }
}

const triggerFileInput = () => fileInput.value.click()

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (file) await subirArchivo(file)
  e.target.value = ''
}

const handleDrop = async (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) await subirArchivo(file)
}

const subirArchivo = async (file) => {
  console.log('=== SUBIENDO ARCHIVO ===');
  console.log('ID Estudiante (num):', idEstudianteNum.value);
  console.log('Archivo:', file.name, file.type, file.size);
  
  // Validar tipo de archivo
  if (file.type !== 'application/pdf') {
    alert('Formato no permitido. Solo se aceptan archivos PDF');
    return;
  }

  // Validar tamaño (5 MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo no puede superar los 5 MB');
    return;
  }

  cargando.value = true;
  
  try {
    console.log('Llamando a subirCV...');
    const response = await subirCV(idEstudianteNum.value, file);
    console.log('Respuesta completa:', response);
    
    if (response.success) {
      await cargarInfoCV();
      emit('cv-subido', response.data);
      emit('update:cv', response.data);
    } else {
      alert(response.message || 'Error al subir el CV');
    }
  } catch (error) {
    console.error('Error detallado:', error);
    alert('Error al subir el CV: ' + error.message);
  } finally {
    cargando.value = false;
  }
}

const eliminar = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar tu CV?')) return
  
  try {
    const response = await eliminarCV(idEstudianteNum.value)
    
    if (response.success) {
      cvUrl.value = null
      nombreCV.value = ''
      emit('cv-eliminado')
      emit('update:cv', null)
    } else {
      alert(response.message || 'Error al eliminar el CV')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al eliminar el CV')
  }
}

onMounted(() => {
  cargarInfoCV()
})
</script>
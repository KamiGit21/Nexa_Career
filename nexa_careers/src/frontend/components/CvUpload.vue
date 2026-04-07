<template>
  <div class="w-full">
    <div v-if="!cvUrl && !cargando" class="cv-premium-dropzone" @click="triggerFileInput"
      @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
      :class="{ 'drop-zone--active': isDragging }">
      <div class="icon-cv">📂</div>
      <p class="drop-text-main">Arrastra tu CV aquí o haz clic para seleccionar</p>
      <p class="drop-text-sub">Solo archivos PDF (Máx. 5 MB)</p>
      <div class="btn-select-gold">Seleccionar Archivo</div>
    </div>

    <div v-else-if="cargando" class="cv-premium-loading">
      <div class="spinner-gold"></div>
      <p>Subiendo tu currículum...</p>
    </div>

    <div v-else class="cv-premium-success">
      <div class="flex items-center gap-4 w-full">
        <div class="text-4xl">📄</div>
        <div class="flex-1 min-w-0">
          <p class="cv-name-display truncate">{{ nombreCV }}</p>
          <p class="text-[10px] text-green-600 font-bold uppercase">✓ CV cargado correctamente</p>
        </div>
      </div>
    </div>

  <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="handleFileChange" />

  <transition name="fade">
    <div v-if="mensajeFeedback.texto"
      :class="['feedback-msg', mensajeFeedback.tipo === 'success' ? 'msg-success' : 'msg-error']">
      <span class="text-lg">{{ mensajeFeedback.tipo === 'success' ? '✅' : '❌' }}</span>
      <p>{{ mensajeFeedback.texto }}</p>
    </div>
  </transition>

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
const mensajeFeedback = ref({ texto: '', tipo: '' });

const cargarInfoCV = async () => {
  try {
    const response = await obtenerInfoCV(props.idEstudiante)
    if (response.success && response.hasCV) {
      cvUrl.value = `http://localhost:3000/api/estudiantes/${props.idEstudiante}/cv/ver`

      // SOLO si el nombre está vacío (primera carga), ponemos el genérico
      if (!nombreCV.value) {
        nombreCV.value = response.data?.filename || 'Currículum Vitae (PDF)';
      }
    } else {
      cvUrl.value = null;
      nombreCV.value = '';
    }
  } catch (error) {
    console.error('Error al cargar info del CV:', error);
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
  mensajeFeedback.value = { texto: '', tipo: '' };

  if (file.type !== 'application/pdf') {
    mensajeFeedback.value = { texto: 'Rechazado: El archivo debe ser PDF.', tipo: 'error' };
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    mensajeFeedback.value = { texto: 'Rechazado: El archivo supera los 5 MB.', tipo: 'error' };
    return;
  }

  cargando.value = true;
  const nombreRealDeMiCompu = file.name;

  try {
    const response = await subirCV(idEstudianteNum.value, file);

    if (response.success) {
      nombreCV.value = nombreRealDeMiCompu;

      mensajeFeedback.value = { texto: '¡CV subido con éxito!', tipo: 'success' };
      cvUrl.value = `http://localhost:3000/api/estudiantes/${props.idEstudiante}/cv/ver`;

      emit('cv-subido', response.data);
    } else {
      mensajeFeedback.value = { texto: response.message || 'Error al subir', tipo: 'error' };
    }
  } catch (error) {
    mensajeFeedback.value = { texto: 'Error de conexión', tipo: 'error' };
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
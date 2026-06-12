<template>
  <form @submit.prevent="guardar" class="form-grid">
    <div class="avatar-section">
      <div class="avatar-circle">
        {{ obtenerIniciales(formData.nombre, formData.apellido) }}
      </div>
    </div>

    <div class="row-2-col">
      <InputField v-model="formData.nombre" label="Nombre:" placeholder="Nombre" />
      <InputField v-model="formData.apellido" label="Apellido:" placeholder="Apellido" />
    </div>

    <InputField v-model="formData.gmail" label="Correo electrónico institucional (@ucb.edu.bo):"
      placeholder="usuario@ucb.edu.bo" />

    <div class="row-2-col">
      <InputField v-model="formData.telefono" label="Teléfono:" placeholder="Teléfono" />
    </div>

    <TextAreaField v-model="formData.descripcion" label="Descripción / Perfil profesional:"
      placeholder="Cuéntanos sobre ti, tus habilidades y experiencia académica..." />

    <div class="row-2-col">
      <InputField v-model="formData.educacion" label="Educación / Carrera:"
        placeholder="Ej: Ingeniería de Sistemas - UCB" />
      <InputField v-model="formData.habilidades" label="Habilidades principales:"
        placeholder="Ej: Java, Scrum, Inglés C1..." />
    </div>

    <div class="cv-section">
      <label class="label-main">Hoja de Vida (CV):</label>
      <CvUpload :idEstudiante="idEstudiante" @cv-subido="handleCVSubido" @cv-eliminado="handleCVEliminado" />
      <p class="text-xs text-gray-500 mt-1">
        Solo archivos PDF, máximo 5MB
      </p>
    </div>

    <div class="bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/70 rounded-2xl p-6 my-6 space-y-3">
      <div class="flex items-center gap-2">
        <span class="text-xl">✨</span>
        <h4 class="text-sm font-bold text-[#1b2a4a] uppercase tracking-wider">Sugerencias para mejorar tu perfil por IA</h4>
      </div>
      
      <div v-if="analizandoCV" class="flex items-center gap-3 text-sm text-gray-500 py-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#b5943a]"></div>
        <span>Buscando sugerencias guardadas...</span>
      </div>

      <div v-else class="text-sm text-gray-600 leading-relaxed bg-white/80 p-4 rounded-xl border border-amber-100">
        <p class="whitespace-pre-line">{{ sugerenciaIA }}</p>
      </div>
    </div>

    <div class="submit-container">
      <SaveButton label="Guardar Cambios" class="btn-submit" />
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import CvUpload from "../CvUpload.vue";
import SaveButton from "./SaveButton.vue";
import {
  actualizarPerfilEstudiante,
  cambiarContrasenaEstudiante,
  obtenerEstudiantePorId,
  obtenerInfoCV,
  obtenerTipIA // NUEVA IMPORTACIÓN
} from '../../services/estudianteService.js';

const route = useRoute();
const idEstudiante = ref(parseInt(route.params.id));

const analizandoCV = ref(true);
const sugerenciaIA = ref('');

// Datos del formulario
const formData = reactive({
  nombre: '',
  apellido: '',
  gmail: '',
  telefono: '',
  descripcion: '',
  educacion: '',
  habilidades: '',
  contrasena: '',
  confirmarContrasena: ''
});

const obtenerIniciales = (nombre, apellido) => {
  const n = (nombre || '').trim().charAt(0);
  const a = (apellido || '').trim().charAt(0);
  return (n + a).toUpperCase() || '??';
};

// Cargar el Tip o consejo de la IA
const cargarTipIA = async () => {
  analizandoCV.value = true;
  try {
    const response = await obtenerTipIA(idEstudiante.value);
    
    if (response.success && response.data && response.data.tip) {
      sugerenciaIA.value = response.data.tip;
    } else {
      sugerenciaIA.value = 'Aún no hay sugerencias disponibles. Utiliza la herramienta "Nexa AI Advisor" para analizar y mejorar tu perfil.';
    }
  } catch (error) {
    console.error('Error al cargar la sugerencia de la IA:', error);
    sugerenciaIA.value = 'No se pudieron cargar las sugerencias en este momento.';
  } finally {
    analizandoCV.value = false;
  }
};

// Cargar datos actuales del estudiante
const cargarDatosEstudiante = async () => {
  try {
    const response = await obtenerEstudiantePorId(idEstudiante.value);

    if (response.success && response.data) {
      formData.nombre = response.data.nombre || '';
      formData.apellido = response.data.apellido || '';
      formData.gmail = response.data.gmail || '';
      formData.telefono = response.data.telefono || '';
      formData.descripcion = response.data.descripcion || '';
      formData.educacion = response.data.educacion || '';
      formData.habilidades = response.data.habilidades || '';
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
};

const handleCVSubido = (data) => {
  alert('CV subido correctamente');
};

const handleCVEliminado = () => {
  alert('CV eliminado correctamente');
};

const guardar = async () => {
  if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    const infoCV = await obtenerInfoCV(idEstudiante.value);

    const cvActual = infoCV.success && infoCV.hasCV
      ? infoCV.data.filename
      : null;

    const perfilData = {
      telefono: formData.telefono,
      gmail: formData.gmail,
      descripcion: formData.descripcion,
      educacion: formData.educacion,
      habilidades: formData.habilidades,
      cv: cvActual
    };

    const perfilResponse = await actualizarPerfilEstudiante(idEstudiante.value, perfilData);

    if (!perfilResponse.success) {
      alert('Error al actualizar perfil: ' + perfilResponse.message);
      return;
    }

    if (formData.contrasena) {
      const passResponse = await cambiarContrasenaEstudiante(idEstudiante.value, {
        contrasena: formData.contrasena
      });

      if (!passResponse.success) {
        alert('Error al cambiar contraseña: ' + passResponse.message);
        return;
      }

      formData.contrasena = '';
      formData.confirmarContrasena = '';
    }

    alert('Perfil actualizado correctamente');

    await cargarDatosEstudiante();

  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar los cambios: ' + error.message);
  }
};

onMounted(() => {
  cargarDatosEstudiante();
  cargarTipIA(); 
});
</script>

<style src="../../assets/styles/perfil-estudiante.css"></style>
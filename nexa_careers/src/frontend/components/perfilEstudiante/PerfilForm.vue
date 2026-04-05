<template>
  <form @submit.prevent="guardar" class="form-grid">
    <div class="avatar-section">
      <AvatarUpload />
      <button type="button" class="btn-text">Cambiar foto</button>
    </div>

    <div class="row-2-col">
      <InputField label="Nombre:" placeholder="Nombre" />
      <InputField label="Apellido:" placeholder="Apellido" />
    </div>

    <InputField label="Correo electrónico institucional (@ucb.edu.bo):" placeholder="usuario@ucb.edu.bo" />

    <div class="row-2-col">
      <InputField label="Teléfono:" placeholder="Teléfono" />
    </div>

    <TextAreaField label="Descripción / Perfil profesional:"
      placeholder="Cuéntanos sobre ti, tus habilidades y experiencia académica..." maxlength="500" />

    <!-- SECCIÓN DE CV -->
    <div class="cv-section">
      <label class="label-main">Hoja de Vida (CV):</label>
      <CvUpload 
        :idEstudiante="idEstudiante"
        @cv-subido="handleCVSubido"
        @cv-eliminado="handleCVEliminado"
      />
      <p class="text-xs text-gray-500 mt-1">
        Solo archivos PDF, máximo 5MB
      </p>
    </div>

    <div class="password-group">
      <div class="flex-between">
          <label class="label-main">Contraseña:</label>
      </div>
      <PasswordField />
    </div>

    <InputField label="Confirmar Contraseña:" type="password" placeholder="********" />

    <div class="submit-container">
      <SaveButton label="Guardar Cambios" class="btn-submit" />
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AvatarUpload from "./AvatarUpload.vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import CvUpload from "../CvUpload.vue";
import SaveButton from "./SaveButton.vue";

const route = useRoute();
const idEstudiante = ref(route.params.id);

// Verificar en consola que el id se está obteniendo correctamente
//console.log('ID del estudiante desde la URL:', idEstudiante.value);

// probar este log
console.log('PerfilForm - ID desde URL:', route.params.id);
console.log('PerfilForm - idEstudiante:', idEstudiante.value);

const handleCVSubido = (data) => {
  console.log('CV subido correctamente:', data);
  alert('CV subido correctamente');
};

const handleCVEliminado = () => {
  console.log('CV eliminado correctamente');
  alert('CV eliminado correctamente');
};

const guardar = async () => {
  console.log('Guardando perfil...');
  // Aquí va tu lógica de guardado del perfil
};
</script>

<style src="../../assets/styles/perfil-estudiante.css"></style>
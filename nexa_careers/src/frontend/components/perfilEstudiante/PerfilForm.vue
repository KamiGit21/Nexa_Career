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

    <div class="cv-section">
      <label class="label-main">Hoja de Vida (CV):</label>
      <FileUpload ref="cvUploadRef" @file-uploaded="handleFileUpload" />
      <div class="action-buttons">
          <button type="button" class="btn-sm btn-dark" @click="eliminarCV">Eliminar</button>
      </div>
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
import { ref } from 'vue';
import AvatarUpload from "./AvatarUpload.vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import FileUpload from "./FileUpload.vue";
import SaveButton from "./SaveButton.vue";

const cvFile = ref(null);     
const cvUploadRef = ref(null);

const handleFileUpload = (file) => {
  cvFile.value = file;
  console.log("Archivo listo para subir:", file.name);
};

const eliminarCV = () => {
  cvFile.value = null;
  cvUploadRef.value.clear();
  console.log("Archivo eliminado");
};

const guardar = async () => {
  
};
</script>

<style src="../../assets/styles/perfil-estudiante.css"></style>
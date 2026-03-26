<template>
  <div class="card">
    <h2>Editar Perfil</h2>

    <AvatarUpload />

    <div class="row">
      <InputField label="Nombre" />
      <InputField label="Apellido" />
    </div>

    <InputField label="Correo institucional" />

    <InputField label="Carrera" />

    <div class="row">
      <InputField label="Dirección" />
      <InputField label="Teléfono" />
    </div>

    <TextAreaField label="Descripción / Perfil profesional" />

    <FileUpload />

    <PasswordField />

    <InputField label="Confirmar Contraseña" type="password" />

    <ToggleSwitch label="Cuenta activa" />

    <SaveButton @click="guardar" />

    <!-- MODALES -->
    <SuccessModal
      :visible="showSuccess"
      @close="showSuccess = false"
    />

    <ErrorModal
      :visible="showError"
      @close="showError = false"
      @retry="guardar"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

import AvatarUpload from "./AvatarUpload.vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import FileUpload from "./FileUpload.vue";
import PasswordField from "./PasswordField.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import SaveButton from "./SaveButton.vue";

import SuccessModal from "./modals/SuccessModal.vue";
import ErrorModal from "./modals/ErrorModal.vue";

const showSuccess = ref(false);
const showError = ref(false);

const guardar = async () => {
  try {
    const ok = Math.random() > 0.5;

    if (ok) showSuccess.value = true;
    else throw new Error();
  } catch {
    showError.value = true;
  }
};
</script>

<style scoped>
.card {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 16px;
  width: 600px;
}

.row {
  display: flex;
  gap: 10px;
}
</style>
<template>
  <div class="card">
    <h2>Editar Cuenta</h2>

    <LogoUpload />

    <InputField label="Nombre de la Empresa" />

    <div class="row">
      <InputField label="Nombre" />
      <InputField label="Apellido" />
    </div>

    <SelectField label="Sector / Rubro" />

    <TextAreaField label="Descripción de la Empresa" />

    <h4>Datos de contacto</h4>

    <InputField label="Correo electrónico" disabled />

    <InputField label="Teléfono" />

    <h4>Seguridad</h4>

    <PasswordField label="Contraseña actual" />

    <div class="row">
      <InputField label="Nueva contraseña" type="password" />
      <InputField label="Confirmar contraseña" type="password" />
    </div>

    <ToggleSwitch label="Cuenta activa" />
    
    <SaveButtons @save="guardar" />

    <SuccessModal :visible="success" @close="success=false"/>
    <ErrorModal :visible="error" @close="error=false" @retry="guardar"/>
  </div>
</template>

<script setup>
import { ref } from "vue";

import LogoUpload from "./LogoUpload.vue";
import InputField from "./InputField.vue";
import SelectField from "./SelectField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import SaveButtons from "./SaveButtons.vue";

import SuccessModal from "./modals/SuccessModal.vue";
import ErrorModal from "./modals/ErrorModal.vue";

const success = ref(false);
const error = ref(false);

const guardar = () => {
  Math.random() > 0.5 ? success.value = true : error.value = true;
};
</script>
<style scoped>
.card {
  background: var(--bg-card);
  padding: 45px;
  border-radius: 20px;
  width: 680px;
}

h2 {
  text-align: center;
  color: var(--accent);
  font-size: 26px;
  font-weight: 700;
}

.divider {
  height: 1px;
  background: #ddd;
  margin: 20px 0;
}

.row {
  display: flex;
  gap: 12px;
}

</style>
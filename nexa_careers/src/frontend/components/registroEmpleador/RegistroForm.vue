<template>
  <div class="form-card">
    <h2>Registro de Empleador</h2>

    <InputField label="Nombre de la Empresa" placeholder="Ej. Empresa S.A." />

    <div class="row">
      <InputField label="Nombre" />
      <InputField label="Apellido" />
    </div>

    <InputField label="Correo institucional" placeholder="empresa@ucb.edu.bo" />

    <div class="row">
      <InputField label="Dirección" />
      <InputField label="Teléfono" placeholder="+591" />
    </div>

    <SelectField label="Sector / Rubro" />

    <TextAreaField label="Descripción de la Empresa" />

    <PasswordField />

    <InputField label="Confirmar Contraseña" type="password" />

    <RegisterButtons />
  </div>
</template>

<script setup>
import InputField from "./InputField.vue";
import SelectField from "./SelectField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import RegisterButtons from "./RegisterButtons.vue";
</script>

<style scoped>
.form-card {
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
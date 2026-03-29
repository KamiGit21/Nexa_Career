<template>
  <div class="card">
    <h2>Editar Cuenta</h2>

    <LogoUpload />

    <InputField 
      label="Nombre de la Empresa" 
      v-model="form.empresa"
      placeholder="Ej. Tech Solutions S.A."
    />

    <div class="row">
      <InputField label="Nombre" v-model="form.nombre" placeholder="Nombre del representante" />
      <InputField label="Apellido" v-model="form.apellido" placeholder="Apellido del representante" />
    </div>

    <SelectField label="Sector / Rubro" v-model="form.sector" />

    <TextAreaField label="Descripción de la Empresa" v-model="form.descripcion" />

    <h4>Datos de contacto</h4>

    <InputField label="Correo electrónico" v-model="form.gmail" disabled />

    <InputField label="Teléfono" v-model="form.telefono" placeholder="Ej. 71234567" />

    <h4>Seguridad</h4>

    <PasswordField 
      label="Nueva contraseña" 
      v-model="password.nueva"
      placeholder="Nueva contraseña"
    />

    <PasswordField 
      label="Confirmar contraseña" 
      v-model="password.confirmar"
      placeholder="Confirmar nueva contraseña"
    />

    <PasswordStrength :password="password.nueva" />

    <ToggleSwitch label="Cuenta activa" v-model="form.activo" />
    
    <SaveButtons @save="guardar" :loading="loading" />

    <SuccessModal :visible="success" @close="success=false" />
    <ErrorModal :visible="error" @close="error=false" @retry="guardar" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import LogoUpload from "./LogoUpload.vue";
import InputField from "./InputField.vue";
import SelectField from "./SelectField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import PasswordStrength from "./PasswordStrength.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import SaveButtons from "./SaveButtons.vue";
import SuccessModal from "./modals/SuccessModal.vue";
import ErrorModal from "./modals/ErrorModal.vue";

import { obtenerEmpleadorPorId, actualizarPerfilEmpleador, cambiarContrasenaEmpleador } from "../../services/empleadorService.js";

const router = useRouter();
const loading = ref(false);
const success = ref(false);
const error = ref(false);

const form = ref({
  id_empleador: null,
  empresa: '',
  nombre: '',
  apellido: '',
  sector: '',
  descripcion: '',
  gmail: '',
  telefono: '',
  activo: 1
});

const password = ref({
  nueva: '',
  confirmar: ''
});

// Cargar datos del empleador
onMounted(async () => {
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion || sesion.rol !== 'empleador') {
      router.push('/inicio-sesion');
      return;
    }
    
    const response = await obtenerEmpleadorPorId(sesion.id);
    console.log('Perfil cargado:', response);
    
    if (response.success) {
      const data = response.data;
      form.value = {
        id_empleador: data.id_empleador,
        empresa: data.empresa || '',
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        sector: data.sector || '',
        descripcion: data.descripcion || '',
        gmail: data.gmail || '',
        telefono: data.telefono || '',
        activo: data.activo !== undefined ? data.activo : 1
      };
    } else {
      alert('Error al cargar el perfil');
    }
  } catch (err) {
    console.error('Error al cargar perfil:', err);
    alert('Error de conexión con el servidor');
  }
});

const guardar = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    // 1. Actualizar perfil
   const perfilResponse = await actualizarPerfilEmpleador(form.value.id_empleador, {
    empresa: form.value.empresa,
    telefono: form.value.telefono,
    gmail: form.value.gmail,        
    nombre: form.value.nombre,     
    apellido: form.value.apellido,  
    descripcion: form.value.descripcion 
  });
    
    if (!perfilResponse.success) {
      throw new Error(perfilResponse.message || 'Error al actualizar perfil');
    }
    
    // 2. Cambiar contraseña si se ingresó una nueva
    if (password.value.nueva) {
      if (password.value.nueva !== password.value.confirmar) {
        alert('Las contraseñas no coinciden');
        loading.value = false;
        return;
      }
      
      if (password.value.nueva.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        loading.value = false;
        return;
      }
      
      const passResponse = await cambiarContrasenaEmpleador(form.value.id_empleador, {
        contrasena: password.value.nueva
      });
      
      if (!passResponse.success) {
        throw new Error(passResponse.message || 'Error al cambiar contraseña');
      }
      
      // Limpiar campos de contraseña
      password.value.nueva = '';
      password.value.confirmar = '';
    }
    
    success.value = true;
    
    // Actualizar localStorage con nuevos datos
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    sesion.empresa = form.value.empresa;
    localStorage.setItem('sesion', JSON.stringify(sesion));
    
  } catch (err) {
    console.error('Error al guardar:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
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

h4 {
  margin: 20px 0 10px 0;
  font-size: 16px;
  color: #333;
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
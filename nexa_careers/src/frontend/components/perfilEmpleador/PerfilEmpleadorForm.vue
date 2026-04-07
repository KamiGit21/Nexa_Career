<template>
  <div class="card">
    <h2>Editar Cuenta</h2>

    <div class="logo-section">
      <div class="company-avatar">
        {{ inicialesComputadas }}
      </div>
      <!--<button type="button" class="btn-change-logo">Cambiar Logo Corporativo</button>-->
    </div>

    <InputField label="Nombre de la Empresa" v-model="form.empresa" placeholder="Ej. Tech Solutions S.A." />

    <div class="row">
      <!-- <InputField label="Nombre" v-model="form.nombre" placeholder="Nombre del representante" /> -->
      <!-- <InputField label="Apellido" v-model="form.apellido" placeholder="Apellido del representante" /> -->
    </div>

    <!--<SelectField label="Sector / Rubro" v-model="form.sector" />-->

    <TextAreaField label="Descripción de la Empresa" v-model="form.descripcion" />

    <h4>Datos de contacto</h4>

    <InputField label="Correo electrónico" v-model="form.gmail" disabled />

    <InputField label="Teléfono" v-model="form.telefono" placeholder="Ej. 71234567" />

    <h4>Seguridad</h4>

    <PasswordField label="Nueva contraseña" v-model="password.nueva" placeholder="Nueva contraseña" />

    <PasswordField label="Confirmar contraseña" v-model="password.confirmar" placeholder="Confirmar nueva contraseña" />

    <PasswordStrength :password="password.nueva" />

    <SaveButtons @save="guardar" :loading="loading" />

    <SuccessModal :visible="success" @close="success = false" />
    <ErrorModal :visible="error" @close="error = false" @retry="guardar" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import PasswordStrength from "./PasswordStrength.vue";
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
  // nombre: '',
  // apellido: '',
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

const inicialesComputadas = computed(() => {
  return obtenerInicialesEmpresa(form.value.empresa);
});

const obtenerInicialesEmpresa = (nombre) => {
  if (!nombre) return '??';
  
  const palabras = nombre.trim().split(/\s+/);
  
  if (palabras.length >= 2) {
    return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
  } else {
    return nombre.substring(0, 3).toUpperCase();
  }
};


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
        // nombre: data.nombre || '',
        // apellido: data.apellido || '',
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
  sesion.empresa = form.value.empresa;
  localStorage.setItem('sesion', JSON.stringify(sesion));

  try {
    // 1. Actualizar perfil
    const perfilResponse = await actualizarPerfilEmpleador(form.value.id_empleador, {
      empresa: form.value.empresa,
      telefono: form.value.telefono,
      gmail: form.value.gmail,
      // nombre: form.value.nombre,     
      // apellido: form.value.apellido,  
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
/* Contenedor principal estilo Glassmorphism */
.card {
  background: #ffffff;
  padding: 40px;
  border-radius: 30px;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  color: #D1B16D;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -0.5px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 35px;
}

.company-avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #1b2a4a 0%, #2c4170 100%);
  color: #d1b16d; 
  border-radius: 35px; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  border: 5px solid #f8f5f0;
  box-shadow: 0 10px 25px rgba(27, 42, 74, 0.2);
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.company-avatar:hover {
  transform: rotate(-3deg) scale(1.05);
}

.btn-change-logo {
  background: none;
  border: none;
  color: #1b2a4a;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  opacity: 0.7;
}

.btn-change-logo:hover {
  opacity: 1;
  color: #d1b16d;
}

h4 {
  margin: 30px 0 15px 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #d1b16d;
  font-weight: 700;
  border-bottom: 2px solid #f8f5f0;
  padding-bottom: 5px;
}

.row {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

:deep(.btn-save) {
  width: 100%;
  margin-top: 20px;
}
</style>
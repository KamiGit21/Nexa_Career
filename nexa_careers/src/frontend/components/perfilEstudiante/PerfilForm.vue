<template>
  <form @submit.prevent="guardar" class="form-grid">
    <div class="avatar-section">
      <AvatarUpload />
      <button type="button" class="btn-text">Cambiar foto</button>
    </div>

    <div class="row-2-col">
      <InputField v-model="formData.nombre" label="Nombre:" placeholder="Nombre" />
      <InputField v-model="formData.apellido" label="Apellido:" placeholder="Apellido" />
    </div>

    <InputField v-model="formData.gmail" label="Correo electrónico institucional (@ucb.edu.bo):" placeholder="usuario@ucb.edu.bo" />

    <div class="row-2-col">
      <InputField v-model="formData.telefono" label="Teléfono:" placeholder="Teléfono" />
    </div>

    <TextAreaField v-model="formData.descripcion" label="Descripción / Perfil profesional:"
      placeholder="Cuéntanos sobre ti, tus habilidades y experiencia académica..." />

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
      <PasswordField v-model="formData.contrasena" />
    </div>

    <InputField v-model="formData.confirmarContrasena" label="Confirmar Contraseña:" type="password" placeholder="********" />

    <div class="submit-container">
      <SaveButton label="Guardar Cambios" class="btn-submit" />
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AvatarUpload from "./AvatarUpload.vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import CvUpload from "../CvUpload.vue";
import SaveButton from "./SaveButton.vue";
import { 
  actualizarPerfilEstudiante, 
  cambiarContrasenaEstudiante, 
  obtenerEstudiantePorId, 
  obtenerInfoCV
} from '../../services/estudianteService.js';

const route = useRoute();
const idEstudiante = ref(parseInt(route.params.id));

// Datos del formulario
const formData = reactive({
  nombre: '',
  apellido: '',
  gmail: '',
  telefono: '',
  descripcion: '',
  contrasena: '',
  confirmarContrasena: ''
});

console.log('PerfilForm - ID:', idEstudiante.value);

// Cargar datos actuales del estudiante
const cargarDatosEstudiante = async () => {
  try {
    const response = await obtenerEstudiantePorId(idEstudiante.value);
    console.log('Datos del estudiante:', response);
    
    if (response.success && response.data) {
      formData.nombre = response.data.nombre || '';
      formData.apellido = response.data.apellido || '';
      formData.gmail = response.data.gmail || '';
      formData.telefono = response.data.telefono || '';
      formData.descripcion = response.data.descripcion || '';
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
};

const handleCVSubido = (data) => {
  console.log('CV subido correctamente:', data);
  alert('CV subido correctamente');
};

const handleCVEliminado = () => {
  console.log('CV eliminado correctamente');
  alert('CV eliminado correctamente');
};

const guardar = async () => {
  console.log('=== GUARDANDO PERFIL ===');
  console.log('Datos del formulario:', formData);
  
  // Validar que las contraseñas coincidan si se ingresó una nueva
  if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
  try {
    // =============================================
    // OBTENER EL CV ACTUAL COMO URL COMPLETA
    // =============================================
    const infoCV = await obtenerInfoCV(idEstudiante.value);
    console.log('Info CV:', infoCV);
    
    // Construir la URL completa del CV si existe
    const cvActual = infoCV.success && infoCV.hasCV 
      ? `http://localhost:3000/api/estudiantes/${idEstudiante.value}/cv/ver`
      : null;
    
    console.log('CV Actual (URL):', cvActual);
    
    // 1. Actualizar perfil (datos básicos + CV como URL)
    const perfilData = {
      telefono: formData.telefono,
      gmail: formData.gmail,
      descripcion: formData.descripcion,
      cv: cvActual  // ← Ahora es una URL válida
    };
    
    console.log('Enviando al backend:', perfilData);
    const perfilResponse = await actualizarPerfilEstudiante(idEstudiante.value, perfilData);
    console.log('Respuesta perfil:', perfilResponse);
    
    if (!perfilResponse.success) {
      alert('Error al actualizar perfil: ' + perfilResponse.message);
      return;
    }
    
    // 2. Cambiar contraseña si se ingresó una nueva
    if (formData.contrasena) {
      const passResponse = await cambiarContrasenaEstudiante(idEstudiante.value, {
        contrasena: formData.contrasena
      });
      
      console.log('Respuesta contraseña:', passResponse);
      
      if (!passResponse.success) {
        alert('Error al cambiar contraseña: ' + passResponse.message);
        return;
      }
      
      // Limpiar campos de contraseña después de guardar
      formData.contrasena = '';
      formData.confirmarContrasena = '';
    }
    
    alert('Perfil actualizado correctamente');
    console.log('✅ Perfil guardado exitosamente');
    
    // Recargar datos actualizados
    await cargarDatosEstudiante();
    
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar los cambios: ' + error.message);
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatosEstudiante();
});
</script>

<style src="../../assets/styles/perfil-estudiante.css"></style>
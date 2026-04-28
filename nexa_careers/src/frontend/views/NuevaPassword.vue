<template>
  <div class="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl">
      <h1 class="text-[#c5a059] text-4xl font-bold text-center mb-6">Recupera tu Cuenta</h1>
      
      <p class="text-[#002855] text-center mb-8 text-lg">
        Por favor ingresa una nueva contraseña para tu cuenta.
      </p>

      <div class="space-y-4">
        <PasswordField 
          v-model="password"
          label="Contraseña nueva:"
          placeholder="Escribe tu nueva contraseña"
          @input="calcularFuerza"
        />

        <div class="py-2">
          <div class="flex items-center gap-3 mt-1">
            <div class="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full transition-all duration-300"
                :style="{ width: porcentajeFuerza + '%', backgroundColor: colorFuerza }"></div>
            </div>
            <span class="text-xs font-medium" :style="{ color: colorFuerza }">{{ etiquetaFuerza }}</span>
          </div>

          <ul class="mt-4 space-y-1 text-sm">
            <li v-for="req in requisitos" :key="req.label" 
                :class="req.met ? 'text-green-600' : 'text-red-500'">
              {{ req.met ? '✓' : '○' }} {{ req.label }}
            </li>
          </ul>
        </div>

        <PasswordField 
          v-model="confirmarPassword"
          label="Confirmar contraseña:"
          placeholder="Repite tu contraseña"
          :error="errorCoincidencia"
        />

        <p v-if="mensajeError" class="text-red-500 text-center font-bold">{{ mensajeError }}</p>

        <div class="pt-6">
          <button 
            @click="confirmarCambio"
            class="w-full py-4 bg-[#1B2A4A] text-[#c5a059] rounded-xl font-bold text-2xl hover:bg-[#001f42] transition-colors disabled:opacity-50"
            :disabled="cargando || errorCoincidencia !== '' || porcentajeFuerza < 100"
          >
            {{ cargando ? 'Guardando...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PasswordField from '@/components/perfilEstudiante/PasswordField.vue';

// Servicios
import { cambiarContrasenaEstudiante } from '@/services/estudianteService.js';
import { cambiarContrasenaEmpleador } from '@/services/empleadorService.js';
import { cambiarContrasenaSupervisor } from '@/services/supervisorService.js';

const router = useRouter();
const password = ref('');
const confirmarPassword = ref('');
const cargando = ref(false);
const mensajeError = ref('');


const porcentajeFuerza = ref(0);
const colorFuerza = ref('#db0000');
const etiquetaFuerza = ref('Débil');
const requisitos = ref([
  { label: 'Al menos 12 caracteres', met: false },
  { label: 'Una letra mayúscula', met: false },
  { label: 'Una letra minúscula', met: false },
  { label: 'Un número', met: false },
  { label: 'Un símbolo', met: false }
]);

const userId = sessionStorage.getItem('recuperacion_id');
const rol = sessionStorage.getItem('recuperacion_rol');

onMounted(() => {
  if (!userId || !rol) {
    router.push('/recuperar-password');
  }
});


const calcularFuerza = () => {
  const p = password.value;
  let count = 0;
    
  requisitos.value[0].met = p.length >= 12;
  requisitos.value[1].met = /[A-Z]/.test(p);
  requisitos.value[2].met = /[a-z]/.test(p);
  requisitos.value[3].met = /[0-9]/.test(p);
  requisitos.value[4].met = /[^A-Za-z0-9]/.test(p);

  count = requisitos.value.filter(r => r.met).length;
  porcentajeFuerza.value = (count / 5) * 100;

  if (count <= 2) { 
    colorFuerza.value = '#db0000'; 
    etiquetaFuerza.value = 'Débil'; 
  } else if (count <= 4) { 
    colorFuerza.value = '#f59e0b'; 
    etiquetaFuerza.value = 'Regular'; 
  } else { 
    colorFuerza.value = '#22c55e'; 
    etiquetaFuerza.value = 'Fuerte'; 
  }
};

const errorCoincidencia = computed(() => {
  if (confirmarPassword.value && password.value !== confirmarPassword.value) {
    return 'Las contraseñas no coinciden';
  }
  return '';
});

const confirmarCambio = async () => {
  if (!password.value || errorCoincidencia.value || porcentajeFuerza.value < 100) {
    mensajeError.value = 'La contraseña debe cumplir con todos los requisitos de seguridad.';
    return;
  }

  cargando.value = true;
  mensajeError.value = '';

  const payload = { contrasena: password.value };
  let respuesta;

  try {
    if (rol === 'estudiante') {
      respuesta = await cambiarContrasenaEstudiante(userId, payload);
    } else if (rol === 'empleador') {
      respuesta = await cambiarContrasenaEmpleador(userId, payload);
    } else if (rol === 'supervisor') {
      respuesta = await cambiarContrasenaSupervisor(userId, payload);
    }

    if (respuesta && respuesta.success) {
      alert('¡Contraseña cambiada con éxito!');
      sessionStorage.clear(); // Limpieza general
      router.push('/login');
    } else {
      mensajeError.value = respuesta?.message || 'Hubo un error al cambiar la contraseña.';
    }
  } catch (error) {
    mensajeError.value = 'Error al conectar con el servidor.';
  } finally {
    cargando.value = false;
  }
};
</script>
<template>
  <div class="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl text-center">
      <h1 class="text-[#c5a059] text-4xl font-bold mb-6">Recupera tu Cuenta</h1>
      
      <p class="text-[#002855] mb-8 text-lg">
        Por favor ingrese el código de recuperación envíado a su correo electrónico.
      </p>

      <div class="max-w-md mx-auto space-y-6 text-left">
        <div>
          <label class="block text-[#002855] font-semibold mb-2 text-xl">
            Introduce el código:
          </label>
          <input 
            v-model="codigoIngresado"
            type="text" 
            class="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#002855] outline-none text-center tracking-widest text-2xl"
            maxlength="6"
            :disabled="cargando"
          />
        </div>

        <p v-if="mensajeError" class="text-red-500 text-center font-bold">{{ mensajeError }}</p>

        <div class="flex gap-4 pt-4">
          <button 
            @click="$router.push('/recuperar-password')"
            class="flex-1 py-3 border-2 border-[#002855] text-[#c5a059] rounded-xl font-bold text-xl"
            :disabled="cargando"
          >
            Volver atrás
          </button>
          <button 
            @click="verificar"
            class="flex-1 py-3 bg-[#1B2A4A] text-[#c5a059] rounded-xl font-bold text-xl"
            :disabled="cargando || codigoIngresado.length < 6"
          >
            {{ cargando ? 'Verificando...' : 'Aceptar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerEstudiantePorGmail } from '@/services/estudianteService.js';
import { obtenerEmpleadorPorGmail } from '@/services/empleadorService.js';
import { obtenerSupervisorPorGmail } from '@/services/supervisorService.js';
import {compararCodigos} from '@/services/codigoService.js';

const router = useRouter();
const codigoIngresado = ref('');
const mensajeError = ref('');

const cargando = ref(false);

const emailGuardado = sessionStorage.getItem('recuperacion_email');
const rolGuardado = sessionStorage.getItem('recuperacion_rol');
const codigoReal = sessionStorage.getItem('recuperacion_codigo');

onMounted(() => {
  if (!emailGuardado || !codigoReal) {
    router.push('/recuperar-password'); 
  }
});

const verificar = async () => {
  mensajeError.value = '';
  const verificar = await compararCodigos(codigoIngresado.value, codigoReal);

  if (!verificar) {
    mensajeError.value = 'Código incorrecto. Inténtalo de nuevo.';
    return;
  }

  cargando.value = true;

  try {
    let respuesta;
    // Buscar ID del usuario
    if (rolGuardado === 'estudiante') {
      respuesta = await obtenerEstudiantePorGmail(emailGuardado);
    } else if (rolGuardado === 'empleador') {
      respuesta = await obtenerEmpleadorPorGmail(emailGuardado);
    } else if (rolGuardado === 'supervisor') {
      respuesta = await obtenerSupervisorPorGmail(emailGuardado);
    }

    if (respuesta && respuesta.success && respuesta.data) {
      const userData = Array.isArray(respuesta.data) ? respuesta.data[0] : respuesta.data;
      const userId = userData.id_estudiante || userData.id_empleador || userData.id_supervisor || userData.id;

      sessionStorage.setItem('recuperacion_id', userId);
      router.push('/nueva-password');
    } else {
      mensajeError.value = 'No se encontró el usuario en la base de datos.';
    }
  } catch (error) {
    mensajeError.value = 'Error al validar la cuenta.';
  } finally {
    cargando.value = false;
  }
};
</script>
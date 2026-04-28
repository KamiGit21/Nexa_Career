<template>
  <div class="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl">
      <h1 class="text-[#D1B16D] text-4xl font-bold text-center mb-6">Recupera tu Cuenta</h1>

      <p class="text-[#002855] text-center mb-8 text-lg px-8">
        Por favor ingrese el correo electrónico asociado a su cuenta. Se le enviará un correo electrónico con un código
        de recuperación.
      </p>

      <div class="space-y-6">
        <div>
          <label class="block text-[#002855] font-semibold mb-2 text-xl">
            Introduce tu dirección de correo electrónico:
          </label>

          <div v-if="mensajeError"
            class="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-pulse">
            <p class="font-bold">Error</p>
            <p>{{ mensajeError }}</p>
          </div>

          <div class="space-y-6">
            <input v-model="email" type="email" placeholder="ejemplo@ucb.edu.bo"
              class="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#002855] outline-none transition-all"
              :disabled="cargando" required />
          </div>

          <div>
            <label class="block text-[#002855] font-semibold mb-2 text-xl">
              Rol:
            </label>
            <select v-model="rol"
              class="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#002855] outline-none transition-all bg-white"
              :disabled="cargando">
              <option value="estudiante">Estudiante</option>
              <option value="empleador">Empleador</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          <div class="flex gap-4 pt-4">
            <button @click="$router.push('/login')"
              class="flex-1 py-3 border-2 border-[#002855] text-[#c5a059] rounded-xl font-bold text-xl hover:bg-gray-50 transition-colors"
              :disabled="cargando">
              Volver atrás
            </button>
            <button @click="enviarCorreo"
              class="flex-1 py-3 bg-[#002855] text-[#c5a059] rounded-xl font-bold text-xl hover:bg-[#001f42] transition-colors"
              :disabled="cargando || !email">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { enviarCodigoAEstudiante, enviarCodigoAEmpleador, enviarCodigoASupervisor } from '@/services/notificacionService.js';
import { crearCodigo } from '@/services/codigoService.js';

const router = useRouter();
const email = ref('');
const rol = ref('estudiante'); // Valor por defecto
const cargando = ref(false);
const mensajeError = ref('');

const enviarCorreo = async () => {
  if (!email.value.trim()) {
    mensajeError.value = 'Por favor ingresa un correo electrónico válido.';
    return;
  }
  cargando.value = true;
  mensajeError.value = '';

  const codigo = await crearCodigo();
  let respuesta;

  try {
    if (rol.value === 'estudiante') {
      respuesta = await enviarCodigoAEstudiante(email.value, codigo);
    } else if (rol.value === 'empleador') {
      respuesta = await enviarCodigoAEmpleador(email.value, codigo);
    } else if (rol.value === 'supervisor') {
      respuesta = await enviarCodigoASupervisor(email.value, codigo);
    }

    if (respuesta && respuesta.success) {
      // Guardar datos en la sesión para el siguiente paso
      sessionStorage.setItem('recuperacion_email', email.value);
      sessionStorage.setItem('recuperacion_rol', rol.value);
      sessionStorage.setItem('recuperacion_codigo', codigo);

      router.push('/verificar-codigo');
    } else {
      mensajeError.value = respuesta?.message || 'Error al enviar el correo. Verifica que exista.';
    }
  } catch (error) {
    mensajeError.value = 'Error de conexión.';
  } finally {
    cargando.value = false;
  }
};
</script>
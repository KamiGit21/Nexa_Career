<template>
  <div class="min-h-screen bg-[#002855] flex items-center justify-center p-4">
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
        />

        <PasswordStrength :password="password" />

        <PasswordField 
          v-model="confirmarPassword"
          label="Confirmar contraseña:"
          placeholder="Repite tu contraseña"
          :error="errorCoincidencia"
        />

        <div class="pt-6">
          <button 
            @click="confirmarCambio"
            class="w-full py-4 bg-[#002855] text-[#c5a059] rounded-xl font-bold text-2xl hover:bg-[#001f42] transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import PasswordField from '@/components/perfilEstudiante/PasswordField.vue';
import PasswordStrength from '@/components/perfilEstudiante/PasswordStrength.vue';

const router = useRouter();
const password = ref('');
const confirmarPassword = ref('');

const errorCoincidencia = computed(() => {
  if (confirmarPassword.value && password.value !== confirmarPassword.value) {
    return 'Las contraseñas no coinciden';
  }
  return '';
});

const confirmarCambio = () => {
  if (password.value && !errorCoincidencia.value) {
    alert('¡Contraseña cambiada con éxito!');
    router.push('/login');
  }
};
</script>
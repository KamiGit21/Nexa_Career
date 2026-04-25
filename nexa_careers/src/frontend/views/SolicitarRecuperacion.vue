<template>
  <div class="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl">
      <h1 class="text-[#D1B16D] text-4xl font-bold text-center mb-6">Recupera tu Cuenta</h1>
      
      <p class="text-[#002855] text-center mb-8 text-lg px-8">
        Por favor ingrese el correo electrónico asociado a su cuenta. Se le enviará un correo electrónico con un código de recuperación.
      </p>

      <div class="space-y-6">
        <div>
          <label class="block text-[#002855] font-semibold mb-2 text-xl">
            Introduce tu dirección de correo electrónico:
          </label>
          <input 
            v-model="email"
            type="email" 
            placeholder="ejemplo@ucb.edu.bo"
            class="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#002855] outline-none transition-all"
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button 
            @click="$router.push('/login')"
            class="flex-1 py-3 border-2 border-[#002855] text-[#c5a059] rounded-xl font-bold text-xl hover:bg-gray-50 transition-colors"
          >
            Volver atrás
          </button>
          <button 
            @click="enviarCorreo"
            class="flex-1 py-3 bg-[#002855] text-[#c5a059] rounded-xl font-bold text-xl hover:bg-[#001f42] transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');

const enviarCorreo = () => {
  //cositas de integracion wiii
  router.push('/verificar-codigo');
};
</script>
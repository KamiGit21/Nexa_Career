<template>
  <div class="min-h-screen bg-[#002855] flex items-center justify-center p-4">
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
            v-model="codigo"
            type="text" 
            class="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-[#002855] outline-none text-center tracking-widest text-2xl"
            maxlength="6"
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button 
            @click="$router.push('/recuperar-password')"
            class="flex-1 py-3 border-2 border-[#002855] text-[#c5a059] rounded-xl font-bold text-xl"
          >
            Volver atrás
          </button>
          <button 
            @click="verificar"
            class="flex-1 py-3 bg-[#002855] text-[#c5a059] rounded-xl font-bold text-xl"
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
const codigo = ref('');

const verificar = () => {
  router.push('/nueva-password');
};
</script>
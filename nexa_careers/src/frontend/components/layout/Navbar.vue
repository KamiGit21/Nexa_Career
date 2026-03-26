<template>
  <nav class="bg-[#1b2a4a] h-20 flex items-center px-8 text-white sticky top-0 z-50 shadow-lg">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 bg-[#d0b06d] rounded-2xl flex items-center justify-center text-[#1b2a4a] font-bold text-xl">N</div>
      <span class="text-2xl font-semibold tracking-tight">Nexa Careers</span>
    </div>

    <div class="flex-1 flex justify-center gap-10 text-lg">
      <router-link to="/home" class="hover:text-[#d0b06d] transition-colors">Inicio</router-link>
      <router-link v-if="sesion.rol === 'empleador'" to="/mis-ofertas" class="hover:text-[#d0b06d] transition-colors">Mis Ofertas</router-link>
    </div>

    <div class="flex items-center gap-6">
      <div v-if="sesion.rol" class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-sm font-medium">{{ sesion.email }}</p>
          <p class="text-xs text-[#d0b06d] capitalize">{{ sesion.rol }}</p>
        </div>
        <div @click="cerrarSesion" 
             class="w-11 h-11 bg-white text-[#1b2a4a] rounded-2xl flex items-center justify-center font-bold text-xl cursor-pointer hover:bg-[#d0b06d] hover:text-white transition-all">
          {{ sesion.email?.charAt(0).toUpperCase() }}
        </div>
      </div>
      <router-link v-else to="/login"
                   class="px-6 py-2.5 bg-white text-[#1b2a4a] font-semibold rounded-2xl hover:bg-[#d0b06d] hover:text-white transition-all">
        Iniciar Sesión
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sesion = ref({ rol: '', email: '' })

onMounted(() => {
  sesion.value = JSON.parse(localStorage.getItem('sesion') || '{}')
})

const cerrarSesion = () => {
  localStorage.removeItem('sesion')
  router.push('/login')
}
</script>
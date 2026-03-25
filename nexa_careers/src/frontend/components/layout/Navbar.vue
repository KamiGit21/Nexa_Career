<template>
  <nav class="w-full h-[126px] bg-[#002349] flex items-center px-12 text-white">
    <div class="text-[#d0b06d] text-[28px] font-semibold">Nexa Careers</div>

    <div class="flex-1 flex justify-center gap-12 text-[25px]">
      <router-link to="/home" class="hover:text-[#d0b06d]">Home</router-link>
      <router-link v-if="sesion.rol === 'empleador'" to="/mis-ofertas" class="hover:text-[#d0b06d]">Mis Ofertas</router-link>
      <router-link v-if="sesion.rol === 'empleador'" to="/mis-ofertas/nueva" class="hover:text-[#d0b06d]">Nueva Oferta</router-link>
    </div>

    <div class="flex items-center gap-6">
      <div class="flex items-center bg-white/10 rounded-full px-5 py-2 text-sm">
        <span class="mr-2">🔍</span>
        <input placeholder="Buscar ofertas..." class="bg-transparent outline-none placeholder-white/70 w-52" />
      </div>

      <div v-if="sesion.rol" class="flex items-center gap-4">
        <div class="text-right">
          <div class="text-sm font-medium">{{ sesion.email }}</div>
          <div class="text-xs text-[#d0b06d] capitalize">{{ sesion.rol }}</div>
        </div>
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#002349] font-bold cursor-pointer" @click="cerrarSesion">
          {{ sesion.email?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>

      <div v-else>
        <router-link to="/login" class="px-6 py-2 bg-white text-[#002349] rounded-[15px] font-semibold hover:bg-[#d0b06d] hover:text-white">
          Iniciar Sesión
        </router-link>
      </div>
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
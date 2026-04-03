<template>
  <nav class="bg-[#1b2a4a] h-20 flex items-center px-8 text-white sticky top-0 z-50 shadow-lg">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 bg-[#d0b06d] rounded-2xl flex items-center justify-center text-[#1b2a4a] font-bold text-xl">N
      </div>
      <span class="text-2xl font-semibold tracking-tight">Nexa Careers</span>
    </div>

    <div class="flex-1 flex justify-center gap-10 text-lg">
      <router-link to="/home" class="hover:text-[#d0b06d] transition-colors">Inicio</router-link>
      <router-link v-if="authState.rol === 'empleador'" to="/mis-ofertas"
        class="hover:text-[#d0b06d] transition-colors">Mis Ofertas</router-link>
    </div>

    <div class="flex items-center gap-6 relative">
      <div v-if="authState.rol" class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-sm font-medium">{{ authState.email }}</p>
          <p class="text-xs text-[#d0b06d] capitalize">{{ authState.rol }}</p>
        </div>

        <div @click="toggleMenu"
          class="w-11 h-11 bg-white text-[#1b2a4a] rounded-2xl flex items-center justify-center font-bold text-xl cursor-pointer hover:bg-[#d0b06d] hover:text-white transition-all">
          {{ authState.email?.charAt(0).toUpperCase() }}
        </div>

        <div v-if="menuAbierto"
          class="absolute right-0 top-16 w-48 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
          <router-link v-if="authState.rol !== 'supervisor'"
            :to="authState.rol === 'estudiante' ? `/perfil-estudiante/${authState.id}` : `/perfil-empleador/${authState.id}`"
            @click="menuAbierto = false"
            class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#1b2a4a] transition-colors text-sm font-medium">
            👤 Mi Perfil
          </router-link>

          <router-link v-else to="/dashboard-supervisor" @click="menuAbierto = false"
            class="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#1b2a4a] transition-colors text-sm font-medium">
            📊 Dashboard
          </router-link>

          <hr class="border-gray-100">
          <button @click="handleLogout"
            class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
            🚪 Cerrar Sesión
          </button>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authState } from '../../auth.js'

const router = useRouter()
const menuAbierto = ref(false)

import { computed } from 'vue'
const sesion = computed(() => {
  return JSON.parse(localStorage.getItem('sesion') || '{}')
})

onMounted(() => {
  window.addEventListener('click', cerrarSiFuera)
})

onUnmounted(() => {
  window.removeEventListener('click', cerrarSiFuera)
})

const toggleMenu = (event) => {
  event.stopPropagation()
  menuAbierto.value = !menuAbierto.value
}

const cerrarSiFuera = () => {
  menuAbierto.value = false
}

const handleLogout = () => {
  menuAbierto.value = false
  authState.logout()
  router.push('/login')
}
</script>
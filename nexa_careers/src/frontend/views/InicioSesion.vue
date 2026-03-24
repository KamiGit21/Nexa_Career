<template>
  <div class="bg-[#fffffd] overflow-hidden w-full min-w-[1440px] min-h-[904px] relative">

    <!-- Foto fondo derecha -->
    <div class="absolute top-[98px] left-[624px] w-[816px] h-[806px] bg-gradient-to-br from-gray-600 to-gray-800" />

    <!-- Panel blanco inclinado -->
    <div class="absolute top-20 left-[199px] w-[571px] h-[902px] bg-[#fffffd] rotate-[-12.27deg]" />

    <!-- Navbar -->
    <div class="absolute top-0 left-0 w-full h-[126px] bg-[#002349]" />
    <nav class="absolute top-0 left-0 w-full h-[126px] flex items-center">
      <a href="#" class="absolute top-12 left-[952px] text-[#d0b06d] text-[25px] whitespace-nowrap no-underline">Home</a>
      <a href="#" class="absolute top-12 left-[1089px] text-[#d0b06d] text-[25px] text-center whitespace-nowrap no-underline">Registrarse</a>
      <div class="absolute top-7 left-[1334px] w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center cursor-pointer">
        <svg width="40" height="40" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="17" r="9" stroke="#002349" stroke-width="2.5" fill="none" />
          <path d="M5 43C5 33.059 13.059 25 23 25C32.941 25 41 33.059 41 43" stroke="#002349" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </svg>
      </div>
    </nav>

    <!-- Contenido -->
    <main>
      <h1 class="absolute top-[211px] left-[230px] w-[345px] font-semibold text-[#d0b06d] text-[35px] text-center leading-normal">
        Inicio de Sesión
      </h1>

      <form class="absolute top-[343px] left-[118px]" @submit.prevent="handleSubmit">

        <!-- Correo -->
        <div class="w-[573px] flex flex-col gap-2.5 mb-9">
          <label for="correo" class="text-[#002349] text-[25px] leading-normal">
            Correo electrónico institucional:
          </label>
          <input id="correo" v-model="form.correo" type="email" autocomplete="email"
            class="ml-[5px] w-[550px] h-10 bg-white rounded-[15px] border border-[#002349] px-3 text-[#002349] text-base focus:outline-none focus:ring-2 focus:ring-[#002349]" />
        </div>

        <!-- Contraseña -->
        <div class="w-[552px] flex flex-col gap-[7px] mb-9">
          <label for="password" class="text-[#002349] text-[25px] leading-normal">Contraseña:</label>
          <input id="password" v-model="form.password" type="password" autocomplete="current-password"
            class="w-[550px] h-10 bg-white rounded-[15px] border border-[#002349] px-3 text-[#002349] text-base focus:outline-none focus:ring-2 focus:ring-[#002349]" />
        </div>

        <!-- Rol -->
        <div class="flex flex-col gap-[7px] mb-9">
          <label for="rol" class="text-[#002349] text-[25px] text-center leading-normal ml-[95px]">
            Selecciona tu rol:
          </label>
          <select id="rol" v-model="form.rol"
            class="w-[427px] h-10 bg-white rounded-[15px] border border-[#002349] px-3 text-[#002349] text-base ml-[8px] appearance-none focus:outline-none focus:ring-2 focus:ring-[#002349]">
            <option value=""></option>
            <option value="estudiante">Estudiante</option>
            <option value="empleador">Empleador</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>

        <!-- Error -->
        <div v-if="errorMsg" class="mb-4 ml-[135px] w-[300px] px-4 py-2 bg-red-50 border border-red-300 rounded-[15px] text-red-700 text-sm text-center">
          {{ errorMsg }}
        </div>

        <!-- Botón -->
        <div class="ml-[135px] w-[302px] h-[50px] relative mb-6">
          <button type="submit"
            class="absolute top-0 left-0 w-[300px] h-[50px] bg-[#002349] rounded-[15px] cursor-pointer hover:bg-[#003366] transition-colors">
            <span class="flex items-center justify-center w-full h-full font-semibold text-[#d0b06d] text-3xl text-center leading-8 whitespace-nowrap">
              Iniciar Sesión
            </span>
          </button>
        </div>

        <!-- Link registro -->
        <p class="w-[606px] font-normal text-[22px] text-center leading-normal ml-[-135px]">
          <span class="text-black">¿No tienes una cuenta? </span>
          <router-link to="/registro-estudiante" class="text-[#3e9eff] underline">Regístrate</router-link>
        </p>

      </form>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InicioSesion',
  data() {
    return {
      errorMsg: '',
      form: { correo: '', password: '', rol: '' }
    }
  },
  methods: {
    handleSubmit() {
      this.errorMsg = ''
      const { correo, password, rol } = this.form
      if (!correo || !password || !rol) {
        this.errorMsg = 'Por favor completa todos los campos.'
        return
      }
      // TODO: POST /api/auth/login  →  { gmail: correo, contrasena: password, rol }
      // Redirigir según rol:
      const rutas = {
        estudiante: '/home',
        empleador: '/mis-ofertas',
        supervisor: '/supervisor'
      }
      this.$router.push(rutas[rol] || '/home')
    }
  }
}
</script>
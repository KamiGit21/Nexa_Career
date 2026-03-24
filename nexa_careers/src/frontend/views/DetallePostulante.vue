<template>
  <div class="bg-[#fffffd] w-full min-w-[1440px] min-h-[1221px] relative">

    <!-- Navbar -->
    <div class="absolute top-0 left-0 w-full h-[126px] bg-[#1b2a4a]" />
    <nav class="absolute top-0 left-0 w-full h-[126px] flex items-center">
      <div class="absolute top-12 left-[950px] text-[#d0b06d] text-[25px] cursor-pointer">Home</div>
      <div class="absolute top-12 left-[1086px] text-[#d0b06d] text-[25px] cursor-pointer">Mis avisos</div>
      <div class="absolute top-7 left-[1334px] w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center cursor-pointer">
        <svg width="40" height="40" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="17" r="9" stroke="#1b2a4a" stroke-width="2.5" fill="none" />
          <path d="M5 43C5 33.059 13.059 25 23 25C32.941 25 41 33.059 41 43" stroke="#1b2a4a" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </svg>
      </div>
    </nav>

    <!-- Info postulante + estado -->
    <p class="absolute top-[145px] left-[50px] text-xl text-center whitespace-nowrap">
      <span class="text-[#d0b06d] font-semibold">Postulante:</span>
      <span class="text-[#1b2a4a]"> {{ postulante.nombre }} {{ postulante.apellido }}</span>
    </p>

    <!-- Badge estado postulación -->
    <div class="absolute top-[145px] left-[450px] flex items-center gap-3">
      <span class="text-sm font-semibold text-gray-500">Estado:</span>
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
        :class="{
          'bg-yellow-100 text-yellow-800': postulante.estado === 'Pendiente',
          'bg-green-100 text-green-800': postulante.estado === 'Aceptado',
          'bg-red-100 text-red-800': postulante.estado === 'Rechazado'
        }">
        <span class="w-2 h-2 rounded-full inline-block"
          :class="{ 'bg-yellow-500': postulante.estado === 'Pendiente', 'bg-green-500': postulante.estado === 'Aceptado', 'bg-red-500': postulante.estado === 'Rechazado' }" />
        {{ postulante.estado }}
      </span>
    </div>

    <!-- Botón volver -->
    <div class="absolute top-[168px] left-[1138px] w-[252px] h-[87px]">
      <div class="absolute top-0 left-0 w-[250px] h-[87px] bg-[#1b2a4a] rounded-[15px]" />
      <button @click="$router.back()"
        class="absolute top-[15px] left-[17px] w-[215px] font-semibold text-[#d0b06d] text-[25px] text-center cursor-pointer bg-transparent border-none">
        Volver a<br />mis avisos
      </button>
    </div>

    <!-- Botones Aceptar / Rechazar -->
    <div v-if="postulante.estado === 'Pendiente'" class="absolute top-[192px] left-[50px] flex items-center gap-4">
      <button @click="aceptar"
        class="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Aceptar postulante
      </button>
      <button @click="rechazar"
        class="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Rechazar postulante
      </button>
    </div>

    <!-- Contenedor CV -->
    <div class="absolute top-[280px] left-[50px] w-[1339px] h-[767px] bg-white border border-[#d0b06d] rounded-[15px] overflow-hidden flex">

      <!-- Sidebar -->
      <div class="w-[200px] min-w-[200px] border-r border-gray-200 bg-white flex flex-col">
        <div class="w-[160px] h-[160px] mx-auto mt-4 border border-gray-300 overflow-hidden flex-shrink-0">
          <div class="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div class="px-3 mt-4">
          <p class="font-semibold text-[11px] text-black mb-1">Sobre mí</p>
          <p class="text-[9px] text-black leading-tight">{{ postulante.sobre }}</p>
        </div>
        <div class="px-3 mt-4">
          <p class="font-semibold text-[11px] text-black mb-2">Contacto</p>
          <p class="text-[9px] text-black mb-1">📞 {{ postulante.telefono }}</p>
          <p class="text-[9px] text-black mb-1">✉ {{ postulante.correo }}</p>
          <p class="text-[9px] text-black">📍 {{ postulante.direccion }}</p>
        </div>
        <div class="px-3 mt-4">
          <p class="font-semibold text-[11px] text-black mb-1">Más información</p>
          <p v-for="(item, i) in postulante.masInfo" :key="i" class="text-[9px] text-black leading-tight">{{ item }}</p>
        </div>
      </div>

      <!-- CV principal -->
      <div class="flex-1 px-6 py-4 overflow-y-auto">
        <h1 class="font-serif text-3xl text-gray-800 leading-tight mb-1">
          {{ postulante.nombre }}<br />{{ postulante.apellido }}
        </h1>
        <p class="text-[9px] uppercase tracking-widest text-gray-500 mb-5">{{ postulante.puesto }}</p>

        <div class="mb-5">
          <h2 class="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Experiencia laboral</h2>
          <div v-for="(exp, i) in postulante.experiencias" :key="i" class="mb-3">
            <p class="text-[10px] font-semibold text-gray-800">{{ exp.titulo }}</p>
            <p class="text-[9px] text-gray-500 mb-1">{{ exp.empresa }}</p>
            <p v-for="(t, j) in exp.tareas" :key="j" class="text-[9px] text-gray-600">{{ t }}</p>
          </div>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Datos académicos</h2>
          <div v-for="(ed, i) in postulante.educacion" :key="i" class="mb-2">
            <p class="text-[10px] font-semibold text-gray-800">{{ ed.institucion }}</p>
            <p class="text-[9px] text-gray-500">{{ ed.detalle }}</p>
          </div>
        </div>

        <div class="flex gap-8">
          <div class="flex-1">
            <h2 class="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Habilidades</h2>
            <p v-for="(s, i) in postulante.habilidades" :key="i" class="text-[9px] text-gray-600">{{ s }}</p>
          </div>
          <div class="flex-1">
            <h2 class="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Idiomas</h2>
            <div v-for="(l, i) in postulante.idiomas" :key="i" class="mb-1">
              <p class="text-[10px] font-semibold text-gray-800">{{ l.nombre }}</p>
              <p class="text-[9px] text-gray-500">{{ l.nivel }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones Ver CV / Descargar CV -->
    <div class="absolute top-[1065px] left-[50px] flex items-center gap-4">
      <button @click="verCV"
        class="flex items-center gap-2 px-6 py-3 bg-[#1b2a4a] text-white text-sm font-semibold rounded-lg hover:bg-[#243660] transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Ver CV
      </button>
      <button @click="descargarCV"
        class="flex items-center gap-2 px-6 py-3 border-2 border-[#1b2a4a] text-[#1b2a4a] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Descargar CV
      </button>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium z-50 flex items-center gap-2"
        :class="toast.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'">
        {{ toast.mensaje }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DetallePostulante',
  data() {
    return {
      toast: { show: false, tipo: 'exito', mensaje: '' },
      // TODO: GET /api/estudiantes/:id  →  cargar datos reales
      postulante: {
        id: 1, nombre: 'Lucia Gloria', apellido: 'Villegas Mendoza',
        correo: 'lucia.villegas@ucb.edu.bo', telefono: '+34-91-1234-567',
        estado: 'Pendiente', cvUrl: '/cvs/lucia_villegas.pdf',
        puesto: 'Agente Comercial',
        sobre: 'Apasionada de las actividades comerciales, me defino por ser una persona con ganas de aprender y una gran líder de grandes equipos.',
        direccion: 'Calle Cualquiera 123, Cualquier Lugar',
        masInfo: ['- Carné de conducir.', '- Vehículo propio.', '- Disponibilidad total.'],
        experiencias: [
          { titulo: 'Agente comercial', empresa: 'Inmobiliaria, S.L. | Enero 2017 - Abril 2019', tareas: ['- Visitas a clientes.', '- Captación de nuevos inmuebles.', '- Elaboración de planes de marketing.'] },
          { titulo: 'Agente comercial', empresa: 'Empresa de seguros, S.L. | Enero 2017 - Abril 2019', tareas: ['- Auxiliar de comercial.', '- Captación de nuevos clientes.'] }
        ],
        educacion: [
          { institucion: 'Universidad del mar', detalle: 'Estudios en economía | Actual' },
          { institucion: 'Centro de estudios San Juan', detalle: 'Actividades comerciales | Nov 2018 - Jul 2021' }
        ],
        habilidades: ['Buena comunicación', 'Gestión de grandes equipos', 'Resolución de problemas', 'Dominio del paquete Office'],
        idiomas: [{ nombre: 'Castellano y catalán:', nivel: 'Nativo.' }, { nombre: 'Inglés:', nivel: 'Nivel alto.' }]
      }
    }
  },
  methods: {
    aceptar() {
      this.postulante.estado = 'Aceptado'
      // TODO: PUT /api/ofertante/:id  →  { estado: 'aceptado' }
      this.mostrarToast('exito', `${this.postulante.nombre} fue aceptado exitosamente.`)
    },
    rechazar() {
      this.postulante.estado = 'Rechazado'
      // TODO: PUT /api/ofertante/:id  →  { estado: 'rechazado' }
      this.mostrarToast('error', `${this.postulante.nombre} fue rechazado.`)
    },
    verCV() {
      // TODO: window.open(this.postulante.cvUrl, '_blank')
      alert('Ver CV: ' + this.postulante.cvUrl)
    },
    descargarCV() {
      // TODO: descargar desde this.postulante.cvUrl
      const link = document.createElement('a')
      link.href = this.postulante.cvUrl || '#'
      link.download = `CV_${this.postulante.nombre}_${this.postulante.apellido}.pdf`
      link.click()
    },
    mostrarToast(tipo, mensaje) {
      this.toast = { show: true, tipo, mensaje }
      setTimeout(() => { this.toast.show = false }, 3500)
    }
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
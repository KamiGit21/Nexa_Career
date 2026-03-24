<template>
  <div class="w-full min-w-[1280px] min-h-[900px] flex flex-col" style="background:#f0f2f5">

    <!-- Navbar -->
    <nav class="w-full flex items-center justify-between px-8 bg-[#1b2a4a]" style="height:52px;min-height:52px;">
      <div class="flex items-center" />
      <div class="flex items-center gap-8 mr-12">
        <router-link to="/home" class="text-white text-[15px] no-underline hover:opacity-80">Home</router-link>
        <router-link to="/mis-ofertas" class="font-bold text-[#b5943a] text-[15px] no-underline">Mis Ofertas</router-link>
        <router-link to="/mis-ofertas/nueva" class="text-white text-[15px] no-underline hover:opacity-80">Postulantes</router-link>
        <router-link to="/login" class="text-white text-[15px] no-underline hover:opacity-80">Mi Cuenta</router-link>
      </div>
      <div class="absolute right-0 top-0 flex items-center justify-center" style="width:52px;height:52px;background:#253554;border-radius:0 0 0 8px;">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="13" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="2" y="13" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="13" y="13" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
        </svg>
      </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="w-full flex items-center px-8 bg-white border-b border-gray-200" style="height:40px;">
      <router-link to="/mis-ofertas" class="text-[#888888] text-[13px] no-underline hover:underline">Mis Ofertas</router-link>
      <span class="text-[#888888] text-[13px] mx-1">/</span>
      <span class="text-[#1b2a4a] text-[13px]">{{ oferta.titulo }}</span>
      <span class="text-[#888888] text-[13px] ml-1">/ Postulantes</span>
    </div>

    <!-- Contenido -->
    <main class="flex-1 px-[40px] py-[18px] flex flex-col gap-4">

      <!-- Header oferta -->
      <div class="w-full rounded-[10px] flex flex-row items-stretch overflow-hidden" style="background:#1b2a4a;min-height:100px;">
        <div class="flex-1 flex flex-col justify-center px-[28px] py-[18px] gap-[10px]">
          <div class="font-bold text-white text-[17px]">{{ oferta.titulo }}</div>
          <div class="flex items-center gap-3 flex-wrap">
            <span class="font-bold text-[11px] text-white text-center whitespace-nowrap px-3 py-1 rounded" style="background:#253554;">{{ oferta.categoria }}</span>
            <span class="text-white text-xs">· {{ oferta.tipo }} · Apertura: {{ oferta.apertura }}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="inline-block w-2 h-2 rounded-full" style="background:#3b6d11;" />
            <span class="text-[11px] whitespace-nowrap px-2 py-0.5 rounded" style="background:#d4f0c0;color:#3b6d11;">Activa</span>
          </div>
        </div>
        <div class="flex flex-row" style="border-left:1px solid #253554;">
          <div class="flex flex-col items-center justify-center px-[32px] py-[18px] gap-1" style="border-right:1px solid #253554;min-width:140px;">
            <span class="text-white text-xs whitespace-nowrap">Total postulantes</span>
            <span class="font-bold text-[#b5943a] text-3xl">{{ postulantes.length }}</span>
          </div>
          <div class="flex flex-col items-center justify-center px-[32px] py-[18px] gap-1" style="min-width:140px;">
            <span class="text-white text-xs whitespace-nowrap">Pendientes revisar</span>
            <span class="font-bold text-white text-3xl">{{ pendienteCount }}</span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="w-full flex flex-row items-center gap-3 px-[16px] py-[10px] rounded-[8px] bg-white border border-gray-200">
        <div class="flex items-center gap-2 px-3 rounded-[6px] flex-1 bg-[#fafafa] border border-[#e0e0e0]" style="height:36px;max-width:260px;">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#aaaaaa" stroke-width="1.5"/>
            <line x1="10" y1="10" x2="13" y2="13" stroke="#aaaaaa" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input v-model="busqueda" type="text" placeholder="Buscar postulante..."
            class="text-[#aaaaaa] text-[13px] bg-transparent outline-none border-none w-full placeholder-[#aaaaaa]" />
        </div>
        <div class="flex items-center gap-2 px-3 rounded-[6px] bg-[#fafafa] border border-[#e0e0e0]" style="height:36px;min-width:140px;">
          <select v-model="filtroEstado" class="text-[#555555] text-[13px] bg-transparent outline-none border-none cursor-pointer w-full">
            <option value="Todos">Estado: Todos</option>
            <option value="Pendiente">Estado: Pendiente</option>
            <option value="Aceptado">Estado: Aceptado</option>
            <option value="Rechazado">Estado: Rechazado</option>
          </select>
        </div>
        <div class="flex items-center gap-2 px-3 rounded-[6px] bg-[#fafafa] border border-[#e0e0e0]" style="height:36px;min-width:160px;">
          <select v-model="orden" class="text-[#555555] text-[13px] bg-transparent outline-none border-none cursor-pointer w-full">
            <option value="reciente">Orden: Reciente</option>
            <option value="nombre">Orden: Nombre</option>
          </select>
        </div>
        <div class="flex-1" />
        <button class="flex items-center gap-2 px-4 rounded-[6px] text-[#1b2a4a] text-[13px] cursor-pointer hover:bg-gray-50 transition-colors bg-white border border-[#1b2a4a]" style="height:36px;">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v8M3 6l3.5 3.5L10 6" stroke="#1b2a4a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 11h11" stroke="#1b2a4a" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          Exportar lista
        </button>
      </div>

      <!-- Tabla -->
      <div class="w-full rounded-[8px] overflow-hidden bg-white border border-gray-200">
        <!-- Header -->
        <div class="w-full flex flex-row items-center px-[16px] py-[10px] bg-[#1b2a4a]">
          <div class="font-bold text-white text-xs" style="width:40px;min-width:40px;">#</div>
          <div class="font-bold text-white text-xs" style="flex:0 0 200px;min-width:200px;">Postulante</div>
          <div class="font-bold text-white text-xs" style="flex:0 0 190px;min-width:190px;">Correo</div>
          <div class="font-bold text-white text-xs" style="flex:0 0 140px;min-width:140px;">Teléfono</div>
          <div class="font-bold text-white text-xs" style="flex:0 0 130px;min-width:130px;">Fecha postulación</div>
          <div class="font-bold text-white text-xs" style="flex:0 0 80px;min-width:80px;">CV</div>
          <div class="font-bold text-white text-xs" style="flex:0 0 120px;min-width:120px;">Estado</div>
          <div class="font-bold text-white text-xs" style="flex:1;min-width:180px;">Acciones</div>
        </div>

        <!-- Filas -->
        <div v-for="(p, i) in postulantesFiltered" :key="p.id"
          class="w-full flex flex-row items-center px-[16px] py-[10px] border-t border-gray-200"
          :style="{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb', minHeight: '56px' }">

          <div class="text-[#888888] text-[13px]" style="width:40px;min-width:40px;">{{ p.id }}</div>

          <div class="flex flex-row items-center gap-3" style="flex:0 0 200px;min-width:200px;">
            <div class="flex items-center justify-center rounded-full font-bold text-[11px] text-center whitespace-nowrap flex-shrink-0"
              style="width:32px;height:32px;min-width:32px;"
              :style="{ background: p.inicialesBg, color: p.inicialesColor }">
              {{ p.iniciales }}
            </div>
            <div class="flex flex-col">
              <span class="text-[#1b2a4a] text-[13px]">{{ p.nombre }}</span>
              <span class="text-[#888888] text-xs">{{ p.carrera }}</span>
            </div>
          </div>

          <div class="text-[#555555] text-xs" style="flex:0 0 190px;min-width:190px;">{{ p.correo }}</div>
          <div class="text-[#555555] text-xs" style="flex:0 0 140px;min-width:140px;">{{ p.telefono }}</div>
          <div class="text-[#555555] text-xs" style="flex:0 0 130px;min-width:130px;">{{ p.fechaPostulacion }}</div>

          <div style="flex:0 0 80px;min-width:80px;">
            <button @click="verDetalle(p)"
              class="text-[#1b2a4a] text-[11px] text-center whitespace-nowrap px-2 py-1 rounded hover:bg-gray-100 transition-colors bg-white border border-[#1b2a4a]">
              Ver CV
            </button>
          </div>

          <div class="flex items-center gap-1" style="flex:0 0 120px;min-width:120px;">
            <span class="inline-block w-2 h-2 rounded-full" :style="{ background: estadoConfig[p.estado].dot, minWidth: '8px' }" />
            <span class="text-[11px] whitespace-nowrap" :style="{ color: estadoConfig[p.estado].color }">{{ p.estado }}</span>
          </div>

          <div class="flex flex-row items-center gap-2" style="flex:1;min-width:180px;">
            <template v-if="p.estado === 'Pendiente'">
              <button @click="aceptar(p)"
                class="text-[11px] text-center whitespace-nowrap px-3 py-1 rounded hover:bg-green-50 transition-colors bg-white border border-[#3b6d11] text-[#3b6d11]">
                Aceptar
              </button>
              <button @click="rechazar(p)"
                class="text-[11px] text-center whitespace-nowrap px-3 py-1 rounded hover:bg-red-50 transition-colors bg-white border border-[#a32d2d] text-[#a32d2d]">
                Rechazar
              </button>
            </template>
            <span v-else class="text-[#888888] text-[11px] text-center whitespace-nowrap px-3 py-1 rounded bg-[#f5f5f5] border border-[#e0e0e0]">
              Ya fue procesado
            </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="w-full flex flex-row items-center px-[16px] py-[12px] rounded-[8px] bg-white border border-gray-200">
        <div class="flex flex-col gap-1 flex-1">
          <div class="flex flex-row items-center gap-4">
            <span class="text-[#888888] text-xs">Resumen:</span>
            <span class="flex items-center gap-1 text-[#555555] text-xs"><span class="inline-block w-2 h-2 rounded-full bg-[#ba7517]" />Pendientes: {{ pendienteCount }}</span>
            <span class="flex items-center gap-1 text-[#555555] text-xs"><span class="inline-block w-2 h-2 rounded-full bg-[#3b6d11]" />Aceptados: {{ aceptadoCount }}</span>
            <span class="flex items-center gap-1 text-[#555555] text-xs"><span class="inline-block w-2 h-2 rounded-full bg-[#a32d2d]" />Rechazados: {{ rechazadoCount }}</span>
          </div>
          <span class="text-[#888888] text-xs">Mostrando {{ postulantesFiltered.length }} de {{ postulantes.length }} postulantes</span>
        </div>
        <div class="flex flex-row items-center gap-1">
          <button class="flex items-center justify-center rounded border border-[#e0e0e0] bg-white hover:bg-gray-100" style="width:32px;height:32px;">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="#aaaaaa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="flex items-center justify-center rounded font-bold text-white text-[13px] bg-[#1b2a4a] border border-[#1b2a4a]" style="width:32px;height:32px;">1</button>
          <button class="flex items-center justify-center rounded text-[#aaaaaa] text-[13px] border border-[#e0e0e0] bg-white" style="width:32px;height:32px;">2</button>
          <button class="flex items-center justify-center rounded border border-[#e0e0e0] bg-white hover:bg-gray-100" style="width:32px;height:32px;">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke="#aaaaaa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </main>

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
  name: 'ListaPostulantes',
  data() {
    return {
      busqueda: '', filtroEstado: 'Todos', orden: 'reciente',
      toast: { show: false, tipo: 'exito', mensaje: '' },
      estadoConfig: {
        Pendiente: { color: '#ba7517', dot: '#ba7517' },
        Aceptado: { color: '#3b6d11', dot: '#3b6d11' },
        Rechazado: { color: '#a32d2d', dot: '#a32d2d' }
      },
      // TODO: GET /api/ofertas/:id  →  datos de la oferta
      oferta: { titulo: 'Desarrollador Backend', categoria: 'Tecnología', tipo: 'Tiempo completo', apertura: '01 mar 2026' },
      // TODO: GET /api/ofertante?id_oferta=:id  →  lista de postulantes
      postulantes: [
        { id: 1, iniciales: 'AM', inicialesColor: '#1b2a4a', inicialesBg: '#dce8ff', nombre: 'Andrea Mamani', carrera: 'Ing. de Sistemas · 3er año', correo: 'a.mamani@ucb.edu.bo', telefono: '+591 73 456 789', fechaPostulacion: '18 mar 2026', estado: 'Pendiente' },
        { id: 2, iniciales: 'LR', inicialesColor: '#533ab7', inicialesBg: '#ede9ff', nombre: 'Luis Rojas', carrera: 'Ing. de Sistemas · 4to año', correo: 'l.rojas@ucb.edu.bo', telefono: '+591 76 123 456', fechaPostulacion: '17 mar 2026', estado: 'Aceptado' },
        { id: 3, iniciales: 'KT', inicialesColor: '#0f6e56', inicialesBg: '#d4f5ec', nombre: 'Karen Torres', carrera: 'Ing. de Software · Egresada', correo: 'k.torres@ucb.edu.bo', telefono: '+591 72 987 654', fechaPostulacion: '16 mar 2026', estado: 'Pendiente' },
        { id: 4, iniciales: 'MP', inicialesColor: '#854f0b', inicialesBg: '#fde8c8', nombre: 'Marco Pinto', carrera: 'Ing. de Sistemas · 3er año', correo: 'm.pinto@ucb.edu.bo', telefono: '+591 71 654 321', fechaPostulacion: '15 mar 2026', estado: 'Rechazado' },
        { id: 5, iniciales: 'SV', inicialesColor: '#993c1d', inicialesBg: '#fde0d4', nombre: 'Sofía Vargas', carrera: 'Ing. de Sistemas · Egresada', correo: 's.vargas@ucb.edu.bo', telefono: '+591 70 222 333', fechaPostulacion: '14 mar 2026', estado: 'Pendiente' },
        { id: 6, iniciales: 'JC', inicialesColor: '#1b2a4a', inicialesBg: '#dce8ff', nombre: 'Juan Condori', carrera: 'Ing. de Sistemas · 4to año', correo: 'j.condori@ucb.edu.bo', telefono: '+591 69 111 222', fechaPostulacion: '13 mar 2026', estado: 'Pendiente' }
      ]
    }
  },
  computed: {
    pendienteCount() { return this.postulantes.filter(p => p.estado === 'Pendiente').length },
    aceptadoCount() { return this.postulantes.filter(p => p.estado === 'Aceptado').length },
    rechazadoCount() { return this.postulantes.filter(p => p.estado === 'Rechazado').length },
    postulantesFiltered() {
      let list = [...this.postulantes]
      if (this.busqueda) { const q = this.busqueda.toLowerCase(); list = list.filter(p => `${p.nombre} ${p.correo}`.toLowerCase().includes(q)) }
      if (this.filtroEstado !== 'Todos') list = list.filter(p => p.estado === this.filtroEstado)
      if (this.orden === 'nombre') list.sort((a, b) => a.nombre.localeCompare(b.nombre))
      return list
    }
  },
  methods: {
    aceptar(p) {
      p.estado = 'Aceptado'
      // TODO: PUT /api/ofertante/:id  →  { estado: 'aceptado' }
      this.mostrarToast('exito', `${p.nombre} fue aceptado exitosamente.`)
    },
    rechazar(p) {
      p.estado = 'Rechazado'
      // TODO: PUT /api/ofertante/:id  →  { estado: 'rechazado' }
      this.mostrarToast('error', `${p.nombre} fue rechazado.`)
    },
    verDetalle(p) {
      this.$router.push({ name: 'DetallePostulante', params: { id: p.id } })
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
<template>
  <div class="w-full min-w-[1024px] min-h-screen bg-[#f5f3ee] font-sans">

    <!-- Navbar -->
    <nav class="w-full bg-[#1b2a4a] h-[52px] flex items-center justify-between px-6">
      <div class="w-8 h-8 bg-[#2a3f6e] rounded flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
          <rect x="10" y="2" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
          <rect x="2" y="10" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
          <rect x="10" y="10" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
        </svg>
      </div>
      <div class="flex items-center gap-8 mr-12">
        <router-link to="/home" class="text-white text-[15px] no-underline hover:opacity-80">Home</router-link>
        <router-link to="/mis-ofertas" class="font-bold text-[#b5943a] text-[15px] no-underline">Mis Ofertas</router-link>
        <router-link to="/mis-ofertas/nueva" class="text-white text-[15px] no-underline hover:opacity-80">Nueva Oferta</router-link>
        <router-link to="/login" class="text-white text-[15px] no-underline hover:opacity-80">Mi Cuenta</router-link>
      </div>
      <div class="w-9 h-9 bg-[#2a3f6e] rounded-lg flex items-center justify-center cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1" fill="white" opacity="0.8"/>
          <rect x="11" y="2" width="7" height="7" rx="1" fill="white" opacity="0.8"/>
          <rect x="2" y="11" width="7" height="7" rx="1" fill="white" opacity="0.8"/>
          <rect x="11" y="11" width="7" height="7" rx="1" fill="white" opacity="0.8"/>
        </svg>
      </div>
    </nav>

    <!-- Empresa header -->
    <div class="w-full bg-white border-b border-[#e0e0e0] px-8 py-4 flex items-center gap-4">
      <div class="w-10 h-10 bg-[#e8f0fb] rounded flex items-center justify-center border border-[#c0d0e8]">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="2" y="2" width="8" height="8" rx="1" fill="#1b2a4a" opacity="0.7"/>
          <rect x="12" y="2" width="8" height="8" rx="1" fill="#1b2a4a" opacity="0.7"/>
          <rect x="2" y="12" width="8" height="8" rx="1" fill="#1b2a4a" opacity="0.7"/>
          <rect x="12" y="12" width="8" height="8" rx="1" fill="#1b2a4a" opacity="0.7"/>
        </svg>
      </div>
      <div>
        <div class="font-bold text-[#1b2a4a] text-base">Nexa Career</div>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="text-[#3b6d11] text-[11px] bg-[#eaf4e0] px-1.5 py-0.5 rounded">Verificada</span>
          <span class="text-[#888888] text-xs">· Tecnología e Innovación</span>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="px-8 py-6">
      <h1 class="font-bold text-[#b5943a] text-[22px] mb-1">Mis Ofertas Laborales</h1>
      <p class="text-[#888888] text-[13px] mb-5">Gestiona las ofertas publicadas por tu empresa.</p>

      <!-- Filtros -->
      <div class="flex items-center gap-3 mb-4">
        <div class="flex items-center gap-2 bg-white border border-[#e0e0e0] rounded px-3 py-2 w-[220px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#aaaaaa" stroke-width="1.5"/>
            <path d="M11 11L14 14" stroke="#aaaaaa" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input v-model="busqueda" type="text" placeholder="Buscar oferta..."
            class="text-[#aaaaaa] text-[13px] bg-transparent outline-none border-none w-full placeholder-[#aaaaaa]" />
        </div>
        <div class="flex items-center gap-2 bg-white border border-[#e0e0e0] rounded px-3 py-2 cursor-pointer min-w-[130px]">
          <select v-model="filtroEstado" class="text-[#555555] text-[13px] bg-transparent outline-none border-none cursor-pointer flex-1 appearance-none">
            <option value="Todos">Estado: Todos</option>
            <option value="Activa">Activa</option>
            <option value="En revisión">En revisión</option>
            <option value="Rechazada">Rechazada</option>
            <option value="Cerrada">Cerrada</option>
          </select>
        </div>
        <div class="flex items-center gap-2 bg-white border border-[#e0e0e0] rounded px-3 py-2 cursor-pointer min-w-[150px]">
          <select v-model="filtroCategoria" class="text-[#555555] text-[13px] bg-transparent outline-none border-none cursor-pointer flex-1 appearance-none">
            <option value="Todas">Categoría: Todas</option>
            <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="flex-1" />
        <router-link to="/mis-ofertas/nueva" class="flex items-center gap-2 bg-[#1b2a4a] text-white px-5 py-2 rounded font-bold text-[13px] no-underline hover:bg-[#243660] transition-colors">
          <span class="text-xl font-normal leading-none">+</span> Nueva Oferta
        </router-link>
      </div>

      <!-- Stats -->
      <div class="flex gap-3 mb-4">
        <div v-for="stat in stats" :key="stat.label" class="bg-white border border-[#e0e0e0] rounded px-4 py-3 min-w-[130px]">
          <div class="text-[#888888] text-xs mb-1">{{ stat.label }}</div>
          <div class="font-bold text-[28px]" :style="{ color: stat.color }">{{ stat.valor }}</div>
        </div>
        <div class="bg-[#1b2a4a] rounded px-4 py-3 min-w-[180px] flex flex-col justify-between">
          <div class="text-white text-xs mb-1">Total postulantes</div>
          <div class="flex items-end gap-3">
            <div class="font-bold text-[#b5943a] text-[28px]">{{ totalPostulantes }}</div>
            <div class="text-[#b5943a] text-xs mb-1">+12 esta semana</div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded border border-[#e0e0e0] overflow-hidden">
        <!-- Header -->
        <div class="bg-[#1b2a4a] flex items-center px-4 py-3">
          <div class="w-[50px] font-bold text-white text-xs">#</div>
          <div class="flex-[2.2] font-bold text-white text-xs">Oferta / Descripción</div>
          <div class="flex-[1] font-bold text-white text-xs">Categoría</div>
          <div class="flex-[0.9] font-bold text-white text-xs">Apertura</div>
          <div class="flex-[0.7] font-bold text-white text-xs text-center">Postulantes</div>
          <div class="flex-[0.8] font-bold text-white text-xs">Estado</div>
          <div class="flex-[1.2] font-bold text-white text-xs">Nota rechazo</div>
          <div class="flex-[1.8] font-bold text-white text-xs text-center">Acciones</div>
        </div>

        <!-- Filas -->
        <div v-for="(oferta, idx) in ofertasFiltradas" :key="oferta.id"
          class="flex items-center px-4 py-3 border-b border-[#f0f0f0]"
          :class="[oferta.borderLeft, idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]']">

          <div class="w-[50px] text-[#888888] text-[13px]">{{ oferta.id }}</div>

          <div class="flex-[2.2]">
            <div class="text-[13px]" :style="{ color: oferta.titleColor }">{{ oferta.titulo }}</div>
            <div class="text-xs mt-0.5" :style="{ color: oferta.descColor }">{{ oferta.descripcion }}</div>
          </div>

          <div class="flex-[1]">
            <span class="inline-block px-2 py-0.5 rounded text-[11px]"
              :style="{ color: oferta.catColor, backgroundColor: oferta.catBg }">{{ oferta.categoria }}</span>
          </div>

          <div class="flex-[0.9] text-[13px]" :style="{ color: oferta.aperturaColor }">{{ oferta.apertura }}</div>

          <div class="flex-[0.7] flex justify-center">
            <button @click="verPostulantes(oferta)"
              class="inline-block px-3 py-0.5 rounded text-[13px] font-bold cursor-pointer"
              :style="{ color: oferta.postColor, backgroundColor: oferta.postBg }">
              {{ oferta.postulantes }}
            </button>
          </div>

          <div class="flex-[0.8]">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
              :style="{ color: oferta.estadoColor, backgroundColor: oferta.estadoBg }">
              <span class="w-1.5 h-1.5 rounded-full inline-block" :style="{ backgroundColor: oferta.estadoDot }" />
              {{ oferta.estado }}
            </span>
          </div>

          <div class="flex-[1.2]">
            <div v-if="oferta.notaRechazo" class="text-[11px]" :style="{ color: oferta.notaColor }">
              <div v-for="(linea, i) in oferta.notaRechazo.split('\n')" :key="i">{{ linea }}</div>
            </div>
            <span v-else class="text-[#cccccc] text-xs">—</span>
          </div>

          <div class="flex-[1.8] flex items-center gap-1.5 justify-center flex-wrap">
            <button v-for="accion in oferta.acciones" :key="accion.label"
              @click="ejecutarAccion(accion, oferta)"
              class="rounded text-[11px] transition-colors"
              :class="accion.tipo === 'delete' ? 'w-7 h-7 flex items-center justify-center border border-[#cccccc] bg-white' : 'px-2.5 py-1 whitespace-nowrap'"
              :style="accion.tipo !== 'delete' ? { border: accion.border, color: accion.color, backgroundColor: accion.bg } : {}">
              <template v-if="accion.tipo === 'delete'">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.75 3.5H12.25" stroke="#cccccc" stroke-width="1.2" stroke-linecap="round"/>
                  <path d="M4.667 3.5V2.333a1.167 1.167 0 011.167-1.167h2.333a1.167 1.167 0 011.166 1.167V3.5M11.083 3.5v8.167a1.167 1.167 0 01-1.166 1.167H4.083a1.167 1.167 0 01-1.166-1.167V3.5h8.167z" stroke="#cccccc" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
              <template v-else>{{ accion.label }}</template>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3 flex-wrap text-xs text-[#555555]">
            <span class="text-[#888888]">Estados:</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#3b6d11] inline-block" />Activa</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#ba7517] inline-block" />En revisión</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#a32d2d] inline-block" />Rechazada</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#888888] inline-block" />Cerrada</span>
          </div>
          <p class="text-[#888888] text-[13px] mt-1">Mostrando {{ ofertasFiltradas.length }} de {{ ofertas.length }} ofertas</p>
        </div>
        <div class="flex items-center gap-1">
          <button class="w-8 h-8 flex items-center justify-center border border-[#e0e0e0] rounded bg-white">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="#aaaaaa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded font-bold text-white text-[13px] bg-[#1b2a4a]">1</button>
          <button class="w-8 h-8 flex items-center justify-center rounded text-[#aaaaaa] text-[13px] border border-[#e0e0e0] bg-white">2</button>
          <button class="w-8 h-8 flex items-center justify-center border border-[#e0e0e0] rounded bg-white">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke="#aaaaaa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium z-50"
        :class="toast.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'">
        {{ toast.mensaje }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MisOfertas',
  data() {
    return {
      busqueda: '', filtroEstado: 'Todos', filtroCategoria: 'Todas',
      toast: { show: false, tipo: 'exito', mensaje: '' },
      categorias: ['Tecnología', 'Diseño', 'Finanzas', 'Marketing', 'Administración'],
      stats: [
        { label: 'Total ofertas', valor: '6', color: '#1b2a4a' },
        { label: 'Activas', valor: '4', color: '#3b6d11' },
        { label: 'En revisión', valor: '1', color: '#ba7517' },
        { label: 'Cerradas', valor: '1', color: '#888888' }
      ],
      totalPostulantes: 83,
      // TODO: GET /api/ofertas?id_empleador=<id>  →  cargar desde backend
      ofertas: [
        {
          id: '001', titulo: 'Desarrollador Backend', descripcion: 'Node.js · Tiempo completo · 1 año exp.',
          categoria: 'Tecnología', catColor: '#1b2a4a', catBg: '#e8f0fb',
          apertura: '01 mar 2026', aperturaColor: '#555555',
          postulantes: 12, postColor: '#1b2a4a', postBg: '#e8f0fb',
          estado: 'Activa', estadoColor: '#3b6d11', estadoBg: '#eaf4e0', estadoDot: '#3b6d11',
          notaRechazo: null, notaColor: '#cccccc', borderLeft: '', titleColor: '#1b2a4a', descColor: '#888888',
          acciones: [
            { label: 'Postulantes', tipo: 'postulantes', color: 'white', bg: '#1b2a4a', border: 'none' },
            { label: 'Editar', tipo: 'editar', color: '#1b2a4a', bg: 'white', border: '1px solid #1b2a4a' },
            { label: 'Cerrar', tipo: 'cerrar', color: '#1b2a4a', bg: 'white', border: '1px solid #1b2a4a' },
            { tipo: 'delete' }
          ]
        },
        {
          id: '002', titulo: 'Diseñador UX/UI', descripcion: 'Figma · Portfolio requerido · Medio tiempo',
          categoria: 'Diseño', catColor: '#533ab7', catBg: '#ede9fb',
          apertura: '15 feb 2026', aperturaColor: '#555555',
          postulantes: 8, postColor: '#1b2a4a', postBg: '#e8f0fb',
          estado: 'Activa', estadoColor: '#3b6d11', estadoBg: '#eaf4e0', estadoDot: '#3b6d11',
          notaRechazo: null, notaColor: '#cccccc', borderLeft: '', titleColor: '#1b2a4a', descColor: '#888888',
          acciones: [
            { label: 'Postulantes', tipo: 'postulantes', color: 'white', bg: '#1b2a4a', border: 'none' },
            { label: 'Editar', tipo: 'editar', color: '#1b2a4a', bg: 'white', border: '1px solid #1b2a4a' },
            { label: 'Cerrar', tipo: 'cerrar', color: '#1b2a4a', bg: 'white', border: '1px solid #1b2a4a' },
            { tipo: 'delete' }
          ]
        },
        {
          id: '003', titulo: 'Analista de Datos', descripcion: 'Python · SQL · Excel avanzado',
          categoria: 'Finanzas', catColor: '#854f0b', catBg: '#fdf0e0',
          apertura: '20 ene 2026', aperturaColor: '#555555',
          postulantes: 24, postColor: '#ba7517', postBg: '#fdf0e0',
          estado: 'En revisión', estadoColor: '#ba7517', estadoBg: '#fdf0e0', estadoDot: '#ba7517',
          notaRechazo: 'Pendiente supervisor', notaColor: '#ba7517', borderLeft: 'border-l-4 border-l-[#ba7517]',
          titleColor: '#1b2a4a', descColor: '#888888',
          acciones: [
            { label: 'Postulantes', tipo: 'postulantes', color: 'white', bg: '#1b2a4a', border: 'none' },
            { label: 'Esperando aprobación', tipo: 'esperando', color: '#ba7517', bg: 'white', border: '1px solid #ba7517' }
          ]
        },
        {
          id: '004', titulo: 'Practicante de Marketing', descripcion: 'Redes sociales · Sin experiencia requerida',
          categoria: 'Marketing', catColor: '#0f6e56', catBg: '#e0f5ef',
          apertura: '05 mar 2026', aperturaColor: '#555555',
          postulantes: 5, postColor: '#1b2a4a', postBg: '#e8f0fb',
          estado: 'Activa', estadoColor: '#3b6d11', estadoBg: '#eaf4e0', estadoDot: '#3b6d11',
          notaRechazo: null, notaColor: '#cccccc', borderLeft: '', titleColor: '#1b2a4a', descColor: '#888888',
          acciones: [
            { label: 'Postulantes', tipo: 'postulantes', color: 'white', bg: '#1b2a4a', border: 'none' },
            { label: 'Editar', tipo: 'editar', color: '#1b2a4a', bg: 'white', border: '1px solid #1b2a4a' },
            { label: 'Cerrar', tipo: 'cerrar', color: '#1b2a4a', bg: 'white', border: '1px solid #1b2a4a' },
            { tipo: 'delete' }
          ]
        },
        {
          id: '005', titulo: 'Asistente Administrativo', descripcion: 'Gestión documentaria · Tiempo completo',
          categoria: 'Administración', catColor: '#888888', catBg: '#f0f0f0',
          apertura: '14 ene 2026', aperturaColor: '#aaaaaa',
          postulantes: 0, postColor: '#888888', postBg: '#f0f0f0',
          estado: 'Rechazada', estadoColor: '#a32d2d', estadoBg: '#fce8e8', estadoDot: '#a32d2d',
          notaRechazo: 'Descripción incompleta.\nAgregar requisitos.', notaColor: '#a32d2d',
          borderLeft: 'border-l-4 border-l-[#a32d2d]', titleColor: '#888888', descColor: '#aaaaaa',
          acciones: [
            { label: 'Corregir', tipo: 'corregir', color: '#a32d2d', bg: 'white', border: '1px solid #a32d2d' },
            { label: 'Volver a publicar', tipo: 'republicar', color: 'white', bg: '#1b2a4a', border: 'none' },
            { tipo: 'delete' }
          ]
        },
        {
          id: '006', titulo: 'Contador General', descripcion: 'Contabilidad · Impuestos · 3 años exp.',
          categoria: 'Finanzas', catColor: '#aaaaaa', catBg: '#f0f0f0',
          apertura: '10 dic 2025', aperturaColor: '#aaaaaa',
          postulantes: 31, postColor: '#888888', postBg: '#f0f0f0',
          estado: 'Cerrada', estadoColor: '#666666', estadoBg: '#eeeeee', estadoDot: '#888888',
          notaRechazo: null, notaColor: '#cccccc', borderLeft: '', titleColor: '#aaaaaa', descColor: '#bbbbbb',
          acciones: [
            { label: 'Postulantes', tipo: 'postulantes', color: '#888888', bg: 'white', border: '1px solid #cccccc' },
            { label: 'Reabrir', tipo: 'reabrir', color: '#1b2a4a', bg: 'white', border: '1px solid #1b2a4a' },
            { tipo: 'delete' }
          ]
        }
      ]
    }
  },
  computed: {
    ofertasFiltradas() {
      return this.ofertas.filter(o => {
        const matchBusqueda = !this.busqueda || o.titulo.toLowerCase().includes(this.busqueda.toLowerCase())
        const matchEstado = this.filtroEstado === 'Todos' || o.estado === this.filtroEstado
        const matchCat = this.filtroCategoria === 'Todas' || o.categoria === this.filtroCategoria
        return matchBusqueda && matchEstado && matchCat
      })
    }
  },
  methods: {
    verPostulantes(oferta) {
      // TODO: navegar a lista de postulantes de esta oferta
      this.$router.push({ name: 'ListaPostulantes', params: { ofertaId: oferta.id } })
    },
    ejecutarAccion(accion, oferta) {
      if (accion.tipo === 'postulantes') { this.verPostulantes(oferta); return }
      if (accion.tipo === 'editar') { this.$router.push({ name: 'NuevaOferta' }); return }
      if (accion.tipo === 'cerrar') {
        oferta.estado = 'Cerrada'; oferta.estadoColor = '#666666'; oferta.estadoBg = '#eeeeee'; oferta.estadoDot = '#888888'
        this.mostrarToast('exito', `Oferta "${oferta.titulo}" cerrada.`); return
      }
      if (accion.tipo === 'delete') {
        // TODO: DELETE /api/ofertas/:id
        const idx = this.ofertas.findIndex(o => o.id === oferta.id)
        if (idx !== -1) this.ofertas.splice(idx, 1)
        this.mostrarToast('exito', `Oferta "${oferta.titulo}" eliminada.`); return
      }
      if (accion.tipo === 'republicar') { oferta.estado = 'En revisión'; oferta.estadoColor = '#ba7517'; oferta.estadoBg = '#fdf0e0'; oferta.estadoDot = '#ba7517'; this.mostrarToast('exito', 'Oferta enviada para revisión.') }
    },
    mostrarToast(tipo, mensaje) {
      this.toast = { show: true, tipo, mensaje }
      setTimeout(() => { this.toast.show = false }, 3000)
    }
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
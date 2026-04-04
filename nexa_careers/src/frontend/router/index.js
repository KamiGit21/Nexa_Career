import { createRouter, createWebHistory } from 'vue-router'

// Home, login y registros
import HomeView from '@/views/HomeView.vue'
import InicioSesion from '@/views/InicioSesion.vue'
import RegistroEstudiante from '@/views/RegistroEstudiante.vue'
import RegistroEmpleador from '@/views/RegistroEmpleador.vue'
import RegistroSupervisor from '@/views/RegistroSupervisor.vue'

// Ofertas y postulantes
import CatalogoOfertas from '@/views/CatalogoOfertas.vue'
import DetalleOferta from '@/views/DetalleOferta.vue'     // ← LÍNEA NUEVA
import MisOfertas from '@/views/MisOfertas.vue'
import NuevaOferta from '@/views/NuevaOferta.vue'
import ListaPostulantes from '@/views/ListaPostulantes.vue'
import DetallePostulante from '@/views/DetallePostulante.vue'
import EditarOferta from '@/views/EditarOferta.vue'

// Perfiles
import PerfilEstudiante from '@/views/EditarPerfilEstudiante.vue'
import PerfilEmpleador from '@/views/EditarPerfilEmpleador.vue'

// Dashboard
import DashboardSupervisor from '@/views/DashboardSupervisor.vue'

//Cursos
import PublicarCurso from '@/views/PublicarCurso.vue'

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { soloPublico: true }
  },

  {
    path: '/login',
    name: 'InicioSesion',
    component: InicioSesion,
    meta: { soloPublico: true }
  },

  {
    path: '/registro-estudiante',
    name: 'RegistroEstudiante',
    component: RegistroEstudiante,
    meta: { soloPublico: true }
  },

  {
    path: '/registro-empleador',
    name: 'RegistroEmpleador',
    component: RegistroEmpleador,
    meta: { soloPublico: true }
  },

  {
    path: '/registro-supervisor',
    name: 'RegistroSupervisor',
    component: RegistroSupervisor,
    meta: { requiereRol: ['supervisor'] }
  },

  { path: '/ofertas', 
    name: 'CatalogoOfertas', 
    component: CatalogoOfertas 
  },


  { path: '/ofertas/:id', name: 'DetalleOferta', component: DetalleOferta }, // ← LÍNEA NUEVA

  { path: '/mis-ofertas', name: 'MisOfertas', component: MisOfertas, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/nueva', name: 'NuevaOferta', component: NuevaOferta, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/:ofertaId/postulantes', name: 'ListaPostulantes', component: ListaPostulantes, meta: { requiereRol: ['empleador'] } },
  { path: '/postulante/:id', name: 'DetallePostulante', component: DetallePostulante, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/:ofertaId/editar', name: 'EditarOferta', component: EditarOferta, meta: { requiereRol: ['empleador'] } }, //cambie esto
  { path: '/:pathMatch(.*)*', redirect: '/home' },

  // Cursos
  {
    path: '/publicar-curso',
    name: 'PublicarCurso',
    component: PublicarCurso,
    meta: { requiereRol: ['estudiante', 'empleador'] }
  },

  // Perfiles
  {
    path: '/perfil-estudiante/:id',
    name: 'PerfilEstudiante',
    component: PerfilEstudiante,
    meta: { requiereRol: ['estudiante'] }
  },
  {
    path: '/perfil-empleador/:id',
    name: 'PerfilEmpleador',
    component: PerfilEmpleador,
    meta: { requiereRol: ['empleador'] }
  },

  // Dashboard Supervisor
  {
    path: '/dashboard-supervisor',
    name: 'DashboardSupervisor',
    component: DashboardSupervisor,
    meta: { requiereRol: ['supervisor'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

// Navegacion por roles
router.beforeEach((to, from, next) => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')

  if (to.meta.soloPublico && sesion.rol && to.path !== '/home') {
    return next('/home')
  }

  if (to.meta.requiereRol && (!sesion.rol || !to.meta.requiereRol.includes(sesion.rol))) {
    return next('/login')
  }

  next()
})

export default router
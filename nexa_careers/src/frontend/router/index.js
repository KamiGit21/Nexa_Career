import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import InicioSesion from '@/views/InicioSesion.vue'
import RegistroEstudiante from '@/views/RegistroEstudiante.vue'
import RegistroEmpleador from '@/views/RegistroEmpleador.vue'
import RegistroSupervisor from '@/views/RegistroSupervisor.vue'
import MisOfertas from '@/views/MisOfertas.vue'
import NuevaOferta from '@/views/NuevaOferta.vue'
import ListaPostulantes from '@/views/ListaPostulantes.vue'
import DetallePostulante from '@/views/DetallePostulante.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: HomeView, meta: { requiereRol: ['estudiante', 'empleador', 'supervisor'] } },
  { path: '/login', name: 'InicioSesion', component: InicioSesion, meta: { soloPublico: true } },
  { path: '/registro-estudiante', name: 'RegistroEstudiante', component: RegistroEstudiante, meta: { soloPublico: true } },
  { path: '/registro-empleador', name: 'RegistroEmpleador', component: RegistroEmpleador, meta: { soloPublico: true } },
  { path: '/registro-supervisor', name: 'RegistroSupervisor', component: RegistroSupervisor, meta: { soloPublico: true } },
  { path: '/mis-ofertas', name: 'MisOfertas', component: MisOfertas, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/nueva', name: 'NuevaOferta', component: NuevaOferta, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/:ofertaId/postulantes', name: 'ListaPostulantes', component: ListaPostulantes, meta: { requiereRol: ['empleador'] } },
  { path: '/postulante/:id', name: 'DetallePostulante', component: DetallePostulante, meta: { requiereRol: ['empleador'] } },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
  if (to.meta.soloPublico && sesion.rol) return next('/home')
  if (to.meta.requiereRol && (!sesion.rol || !to.meta.requiereRol.includes(sesion.rol))) {
    return next('/login')
  }
  next()
})

export default router
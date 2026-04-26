import { createRouter, createWebHistory } from 'vue-router'

// Home, login y registros
import HomeView from '@/views/HomeView.vue'
import InicioSesion from '@/views/InicioSesion.vue'
import RegistroEstudiante from '@/views/RegistroEstudiante.vue'
import RegistroEmpleador from '@/views/RegistroEmpleador.vue'
import RegistroSupervisor from '@/views/RegistroSupervisor.vue'

// Ofertas y postulantes
import CatalogoOfertas from '@/views/CatalogoOfertas.vue'
import DetalleOferta from '@/views/DetalleOferta.vue'
import MisOfertas from '@/views/MisOfertas.vue'
import NuevaOferta from '@/views/NuevaOferta.vue'
import ListaPostulantes from '@/views/ListaPostulantes.vue'
import DetallePostulante from '@/views/DetallePostulante.vue'
import EditarOferta from '@/views/EditarOferta.vue'
import MisPostulaciones from '@/views/MisPostulaciones.vue'

// Perfiles
import PerfilEstudiante from '@/views/EditarPerfilEstudiante.vue'
import PerfilEmpleador from '@/views/EditarPerfilEmpleador.vue'

// Dashboard
import DashboardSupervisor from '@/views/DashboardSupervisor.vue'

// Cursos
import PublicarCurso from '@/views/PublicarCurso.vue'
import CatalogoCursos from '@/views/CatalogoCursos.vue'
import DetalleCurso from '@/views/DetalleCurso.vue'
import EmpleadorCursos from '@/views/EmpleadorCursos.vue'
import EstudianteCursos from '@/views/EstudianteCursos.vue'
import EditarCurso from '@/views/EditarCurso.vue'

//Logs del supervisor
import ListaEstudiantes from '@/views/ListaEstudiantes.vue'
import ListaEmpleadores from '@/views/ListaEmpleadores.vue'
import ListaSupervisores from '@/views/ListaSupervisores.vue'

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

  // Ofertas
  {
    path: '/ofertas',
    name: 'CatalogoOfertas',
    component: CatalogoOfertas
  },

  {
    path: '/ofertas/:id',
    name: 'DetalleOferta',
    component: DetalleOferta
  },

  
  { path: '/mis-ofertas', name: 'MisOfertas', component: MisOfertas, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/nueva', name: 'NuevaOferta', component: NuevaOferta, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/:ofertaId/postulantes', name: 'ListaPostulantes', component: ListaPostulantes, meta: { requiereRol: ['empleador'] } },
  { path: '/postulante/:id', name: 'DetallePostulante', component: DetallePostulante, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-ofertas/:ofertaId/editar', name: 'EditarOferta', component: EditarOferta, meta: { requiereRol: ['empleador'] } },
  { path: '/mis-postulaciones', name: 'MisPostulaciones', component: MisPostulaciones, meta: { requiereRol: ['estudiante'] } },

  // Cursos - rutas separadas por rol (sin conflictos de nombre)
  { path: '/cursos', name: 'CatalogoCursos', component: CatalogoCursos },
  { path: '/cursos/:id', name: 'DetalleCurso', component: DetalleCurso },
  { path: '/publicar-curso', name: 'PublicarCurso', component: PublicarCurso, meta: { requiereRol: ['estudiante', 'empleador'] } },

  {
    path: '/mis-cursos-empleador',
    name: 'EmpleadorCursos',
    component: EmpleadorCursos,
    meta: { requiereRol: ['empleador'] }
  },
  {
    path: '/mis-cursos',
    name: 'EstudianteCursos',
    component: EstudianteCursos,
    meta: { requiereRol: ['estudiante'] }
  },

  {
    path: '/mis-cursos/:id/editar',
    name: 'EditarCurso',
    component: EditarCurso,
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
  },

  //Logs del supervisor
  {
    path: '/supervisor/estudiantes',
    name: 'ListaEstudiantes',
    component: ListaEstudiantes,
    meta: { requiereRol: ['supervisor'] }
  },
  {
    path: '/supervisor/empleadores',
    name: 'ListaEmpleadores',
    component: ListaEmpleadores,
    meta: { requiereRol: ['supervisor'] }
  },
  {
    path: '/supervisor/supervisores',
    name: 'ListaSupervisores',
    component: ListaSupervisores,
    meta: { requiereRol: ['supervisor'] }
  },

  { path: '/:pathMatch(.*)*', redirect: '/home' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

// Navegación por roles
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
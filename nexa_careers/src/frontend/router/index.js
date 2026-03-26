import { createRouter, createWebHistory } from 'vue-router'

// Views existentes
import HomeView          from '@/views/HomeView.vue'

// Views nuevas
import InicioSesion      from '@/views/InicioSesion.vue'
import RegistroEstudiante from '@/views/RegistroEstudiante.vue'
import RegistroEmpleador  from '@/views/RegistroEmpleador.vue'
import RegistroSupervisor from '@/views/RegistroSupervisor.vue'
import MisOfertas         from '@/views/MisOfertas.vue'
import NuevaOferta        from '@/views/NuevaOferta.vue'
import ListaPostulantes   from '@/views/ListaPostulantes.vue'
import DetallePostulante  from '@/views/DetallePostulante.vue'
import PerfilEstudiante  from '@/views/EditarPerfilEstudiante.vue'

const routes = [
  { path: '/',                         redirect: '/home' },
  { path: '/home',                     name: 'Home',               component: HomeView },

  // Autenticación
  { path: '/login',                    name: 'InicioSesion',        component: InicioSesion },

  // Registro
  { path: '/registro-estudiante',      name: 'RegistroEstudiante',  component: RegistroEstudiante },
  { path: '/registro-empleador',       name: 'RegistroEmpleador',   component: RegistroEmpleador },
  { path: '/registro-supervisor',      name: 'RegistroSupervisor',  component: RegistroSupervisor },

  // Ofertas (empleador)
  { path: '/mis-ofertas',              name: 'MisOfertas',          component: MisOfertas },
  { path: '/mis-ofertas/nueva',        name: 'NuevaOferta',         component: NuevaOferta },

  // Postulantes  ← HU: Como empleador quiero ver las solicitudes a mis ofertas
  { path: '/mis-ofertas/:ofertaId/postulantes', name: 'ListaPostulantes', component: ListaPostulantes },
  { path: '/postulantes/:id',          name: 'DetallePostulante',   component: DetallePostulante },

  //Perfiles
  { path: '/perfil-estudiante',          name: 'PerfilEstudiante',    component: PerfilEstudiante }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
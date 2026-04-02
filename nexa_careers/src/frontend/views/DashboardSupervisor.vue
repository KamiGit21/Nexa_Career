<template>
  <div>
    <navbar />
    <div class="flex min-h-screen bg-gray-100 font-sans">
      <aside class="w-64 bg-[#1e293b] text-white flex flex-col">
        <div class="p-6 text-center">
          <h1 class="text-xl font-bold text-yellow-500">Nexa Careers</h1>
          <p class="text-xs text-gray-400">Panel de Supervisor</p>
        </div>

        <div class="flex flex-col items-center py-4">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
            <span class="text-2xl text-gray-800">👤</span>
          </div>
          <h2 class="font-semibold text-sm">{{ supervisor.nombre }}</h2>
          <span class="bg-yellow-600 text-[10px] px-2 py-0.5 rounded mt-1 uppercase font-bold">Supervisor</span>
        </div>

        <nav class="flex-1 mt-4">
          <ul class="space-y-1">
            <li class="px-4 py-3 bg-yellow-600/20 border-l-4 border-yellow-500 flex items-center gap-3">
              <router-link to="/dashboard-supervisor"
                class="flex items-center justify-between hover:bg-slate-700 p-2 rounded-lg transition-colors">
                <div class="flex items-center gap-3">
                  <span>📊</span>
                  <span>Panel Principal</span>
                </div>
                <!--<span class="text-xs bg-slate-600 px-2 py-0.5 rounded">14</span>-->
              </router-link>
            </li>
            <li class="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center">
              <router-link to="/ofertas"
                class="flex items-center justify-between hover:bg-slate-700 p-2 rounded-lg transition-colors">
                <div class="flex items-center gap-3">
                  <span>🏢</span>
                  <span>Ofertas Laborales</span>
                </div>
                <!--<span class="text-xs bg-slate-600 px-2 py-0.5 rounded">14</span>-->
              </router-link>
            </li>

            <li class="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center">
              <router-link to="#"
                class="flex items-center justify-between hover:bg-slate-700 p-2 rounded-lg transition-colors">
                <div class="flex items-center gap-3">
                  <span>🎓</span>
                  <span>Estudiantes</span>
                </div>
                <!--<span class="text-xs bg-slate-600 px-2 py-0.5 rounded">14</span>-->
              </router-link>
            </li>

            <li class="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center">
              <router-link to="#"
                class="flex items-center justify-between hover:bg-slate-700 p-2 rounded-lg transition-colors">
                <div class="flex items-center gap-3">
                  <span>💻</span>
                  <span>Empleadores</span>
                </div>
                <!--<span class="text-xs bg-slate-600 px-2 py-0.5 rounded">14</span>-->
              </router-link>
            </li>

            <li class="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center">
              <router-link to="/registro-supervisor"
                class="flex items-center justify-between hover:bg-slate-700 p-2 rounded-lg transition-colors">
                <div class="flex items-center gap-3">
                  <span>📋</span>
                  <span>Registrar Supervisor</span>
                </div>
                <!--<span class="text-xs bg-slate-600 px-2 py-0.5 rounded">14</span>-->
              </router-link>
            </li>

          </ul>
        </nav>

        <div class="p-4 border-t border-slate-700">
          <button @click="logout"
            class="flex items-center gap-2 text-red-400 hover:text-red-300 w-full px-4 py-2 bg-red-900/20 rounded">
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main class="flex-1 flex flex-col">
        <!--<header class="bg-[#1e293b] text-white px-8 py-4 flex justify-end gap-8 items-center">
        <nav class="flex gap-6 text-sm">
          <a href="/home" class="hover:text-yellow-500">Home</a>
          <a href="#" class="text-yellow-500 border-b-2 border-yellow-500">Panel</a>
          <a href="/catalogo-ofertas" class="hover:text-yellow-500">Ofertas</a>
        </nav>
        <div class="w-8 h-8 bg-white rounded-full"></div>
      </header>-->

        <section class="p-8 overflow-y-auto">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-slate-800">Bienvenido, {{ supervisor.nombre }}</h1>
            <p class="text-sm text-gray-500">Domingo, 22 de marzo de 2026 · Resumen general del sistema</p>
          </div>

          <div class="grid grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
              <p class="text-xs text-gray-500 font-semibold uppercase">Empleadores registrados</p>
              <div class="flex items-end gap-4 mt-2">
                <span class="text-3xl font-bold text-slate-800">{{ estadisticas.empleadores }}</span>
                <!--<span class="text-xs text-green-500 pb-1">+2 este mes</span>-->
              </div>
            </div>
            <!--<div class="bg-[#1e293b] p-6 rounded-xl shadow-sm text-white">
              <p class="text-xs text-gray-400 font-semibold uppercase">Total postulaciones</p>
              <div class="flex items-end gap-4 mt-2">
                <span class="text-3xl font-bold text-yellow-500">247</span>
                <span class="text-xs text-yellow-600/80 pb-1">+38 esta semana</span>
              </div>
            </div>-->
          </div>

          <h3 class="font-bold text-slate-800 mb-4 uppercase text-sm tracking-wider">Acciones rápidas</h3>
          <div class="grid grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <span class="p-2 bg-blue-50 text-blue-600 rounded">✔️</span>
                <h4 class="font-bold text-sm leading-tight">Aprobar<br>Empleadores</h4>
              </div>
              <p class="text-xs text-gray-500 mb-4">3 solicitudes pendientes</p>
              <button class="text-xs bg-slate-800 text-white px-3 py-1.5 rounded w-full">Revisar ahora</button>
            </div>
          </div>

          <h3 class="font-bold text-slate-800 mb-4 uppercase text-sm tracking-wider">Actividad reciente</h3>
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-800 text-white">
                <tr>
                  <th class="p-4 font-semibold">Usuario</th>
                  <th class="p-4 font-semibold">Acción</th>
                  <th class="p-4 font-semibold">Módulo</th>
                  <th class="p-4 font-semibold">Fecha y hora</th>
                  <th class="p-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(act, index) in actividades" :key="index" class="hover:bg-gray-50">
                  <td class="p-4 flex items-center gap-3">
                    <p class="font-bold text-slate-700">{{ act.usuario }}</p>
                  </td>
                  <td class="p-4 text-gray-600 italic">{{ act.accion }}</td>
                  <td class="p-4">{{ act.modulo }}</td>
                  <td class="p-4 text-gray-500">{{ new Date(act.fecha).toLocaleDateString() }}</td>
                  <td class="p-4 text-green-600">● {{ act.estado }}</td>
                </tr>
              </tbody>
            </table>
            <div class="p-4 text-center">
              <a href="#" class="text-yellow-600 font-bold text-xs hover:underline">Ver toda la actividad</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import navbar from '../components/layout/Navbar.vue';
import { obtenerEstadisticasDashboard } from '../services/supervisorService.js';

const router = useRouter();
const supervisor = ref({ nombre: '', email: '' });
const estadisticas = ref({ empleadores: 0, postulaciones: 0, pendientes: 0 });
const actividades = ref([]);
const loading = ref(true);

onMounted(async () => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}');
  if (sesion.rol !== 'supervisor') {
    router.push('/login');
    return;
  }
  supervisor.value = sesion;

  try {
    const response = await obtenerEstadisticasDashboard(); 
    
    if (response.success) {
      estadisticas.value = response.metricas; 
      actividades.value = response.recientes;
    }
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  } finally {
    loading.value = false;
  }
});

const logout = () => {
  localStorage.removeItem('sesion');
  router.push({ name: 'InicioSesion' });
};

const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  return `${d.getDate()} mar · ${d.getHours()}:${d.getMinutes()}`;
};
</script>
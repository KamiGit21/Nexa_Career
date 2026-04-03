<template>
  <div class="flex min-h-screen bg-gray-100 font-sans">
    <main class="flex-1 flex flex-col : w-full">
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
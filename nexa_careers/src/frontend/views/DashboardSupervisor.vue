<template>
  <div class="flex min-h-screen bg-gray-100 font-sans">

    <main class="flex-1 flex flex-col w-full">
      <section class="p-8 overflow-y-auto">

        <div class="mb-8">
          <h1 class="text-2xl font-bold text-slate-800">Bienvenid@, {{ supervisor.nombre }}</h1>
          <p class="text-sm text-gray-500">{{ fechaFormateada }} · Resumen general del sistema</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Empleadores registrados" :value="estadisticas.empleadores" color="#1B2A4A" />
          <StatCard label="Estudiantes registrados" :value="estadisticas.estudiantes" color="#B5943A" />
          <StatCard label="Ofertas activas" :value="estadisticas.ofertas" color="#3B6D11" />
          <StatCard label="Cursos creados" :value="estadisticas.cursos" color="#534AB7" />
        </div>

        <div class="mb-10">
          <h3 class="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest opacity-70">
            Acciones rápidas
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard v-for="(action, index) in quickActions" :key="index" :iconName="action.iconName"
              :title="action.title" :description="action.description" :buttonText="action.buttonText" :borderColor="action.borderColor"
              @action-click="ejecutarAccion(action.route)" />
          </div>
        </div>

        <div class="mb-4 flex justify-between items-center">
          <h3 class="font-bold text-slate-800 uppercase text-xs tracking-widest opacity-70">
            Actividad reciente
          </h3>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table class="w-full text-left text-sm">
            <thead class="bg-[#1e293b] text-white">
              <tr>
                <th class="p-4 font-semibold">Usuario</th>
                <th class="p-4 font-semibold">Acción</th>
                <th class="p-4 font-semibold">Módulo</th>
                <th class="p-4 font-semibold">Fecha y hora</th>
                <th class="p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(act, index) in actividades" :key="index" class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-slate-700">{{ act.usuario }}</td>
                <td class="p-4 text-gray-600 italic">{{ act.accion }}</td>
                <td class="p-4">
                  <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                    {{ act.modulo }}
                  </span>
                </td>
                <td class="p-4 text-gray-500">{{ formatearFecha(act.fecha) }}</td>
                <td class="p-4">
                  <span class="flex items-center gap-1.5 text-green-600 font-medium">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    {{ act.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="p-4 text-center border-t border-gray-50">
            <button class="text-[#b89b4d] font-bold text-xs hover:underline uppercase tracking-tighter">
              Ver toda la actividad
            </button>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import StatCard from '../components/dashboardSupervisor/StatCard.vue';
import QuickActionCard from '../components/dashboardSupervisor/QuickActionCard.vue';
import { obtenerEstadisticasDashboard } from '../services/supervisorService.js';

//imagenes
import imgEmpleadores from '../assets/images/empleadores.png';
import imgOfertas from '../assets/images/ofertas.png';
import imgEstudiantes from '../assets/images/estudiantes.png';
import imgCursos from '../assets/images/cursos.png';


const router = useRouter();

const supervisor = ref({ nombre: '', email: '' });
const estadisticas = ref({ empleadores: 0, estudiantes: 0, ofertas: 0, cursos: 0 });
const actividades = ref([]);
const loading = ref(true);

const quickActions = computed(() => [
  {
    iconName: imgEmpleadores,
    title: 'Lista de<br>Empleadores',
    description: `${estadisticas.value.empleadores} empleadores registrados`,
    buttonText: 'Revisar ahora',
    route: '/empleadores',
    borderColor: '#1B2A4A'
  },
  {
    iconName: imgEstudiantes,
    title: 'Lista de<br>Estudiantes',
    description: `${estadisticas.value.estudiantes} alumnos registrados`,
    buttonText: 'Ver lista',
    route: '/estudiantes',
    borderColor: '#B5943A'
  },
  {
    iconName: imgOfertas,
    title: 'Gestionar<br>Ofertas',
    description: `${estadisticas.value.ofertas} ofertas en revisión`,
    buttonText: 'Ver ofertas',
    route: '/ofertas',
    borderColor: '#3B6D11'
  },
  {
    iconName: imgCursos,
    title: 'Lista de<br>Cursos',
    description: `${estadisticas.value.cursos} cursos creados`,
    buttonText: 'Ver lista',
    route: '/cursos',
    borderColor: '#534AB7'
  }
]);

const fechaFormateada = computed(() => {
  const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString('es-ES', opciones);
});

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
    console.error("Error al sincronizar el Dashboard:", error);
  } finally {
    loading.value = false;
  }
});

const ejecutarAccion = (route) => {
  if (route === 'download') {
    alert("Iniciando descarga del reporte general...");
  } else {
    router.push(route);
  }
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  });
};
</script>

<style scoped>
main {
  background-color: #F5F0E8;
}

tbody tr {
  transition: all 0.2s ease;
}
</style>
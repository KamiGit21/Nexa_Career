<template>
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
        <h2 class="font-semibold text-sm">Carlos Mendoza</h2>
        <span class="bg-yellow-600 text-[10px] px-2 py-0.5 rounded mt-1 uppercase font-bold">Supervisor</span>
      </div>

      <nav class="flex-1 mt-4">
        <ul class="space-y-1">
          <li class="px-4 py-3 bg-yellow-600/20 border-l-4 border-yellow-500 flex items-center gap-3">
             <span>📊</span> Panel Principal
          </li>
          <li class="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center">
            <div class="flex items-center gap-3"><span>🏢</span> Empleadores</div>
            <span class="text-xs bg-slate-600 px-2 py-0.5 rounded">14</span>
          </li>
          <li class="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center">
            <div class="flex items-center gap-3"><span>🎓</span> Estudiantes</div>
            <span class="text-xs bg-slate-600 px-2 py-0.5 rounded">89</span>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-slate-700">
        <button 
        @click="logout"
        class="flex items-center gap-2 text-red-400 hover:text-red-300 w-full px-4 py-2 bg-red-900/20 rounded">
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col">
      <header class="bg-[#1e293b] text-white px-8 py-4 flex justify-end gap-8 items-center">
        <nav class="flex gap-6 text-sm">
          <a href="/home" class="hover:text-yellow-500">Home</a>
          <a href="#" class="text-yellow-500 border-b-2 border-yellow-500">Panel</a>
          <a href="/catalogo-ofertas" class="hover:text-yellow-500">Ofertas</a>
        </nav>
        <div class="w-8 h-8 bg-white rounded-full"></div>
      </header>

      <section class="p-8 overflow-y-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-slate-800">Bienvenido, Carlos</h1>
          <p class="text-sm text-gray-500">Domingo, 22 de marzo de 2026 · Resumen general del sistema</p>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
            <p class="text-xs text-gray-500 font-semibold uppercase">Empleadores registrados</p>
            <div class="flex items-end gap-4 mt-2">
              <span class="text-3xl font-bold text-slate-800">14</span>
              <span class="text-xs text-green-500 pb-1">+2 este mes</span>
            </div>
          </div>
          <div class="bg-[#1e293b] p-6 rounded-xl shadow-sm text-white">
            <p class="text-xs text-gray-400 font-semibold uppercase">Total postulaciones</p>
            <div class="flex items-end gap-4 mt-2">
              <span class="text-3xl font-bold text-yellow-500">247</span>
              <span class="text-xs text-yellow-600/80 pb-1">+38 esta semana</span>
            </div>
          </div>
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
              <tr v-for="i in 5" :key="i" class="hover:bg-gray-50">
                <td class="p-4 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold">NE</div>
                  <div>
                    <p class="font-bold text-slate-700">Nexus Emp. S.A.</p>
                    <p class="text-[10px] text-gray-400">Empleador</p>
                  </div>
                </td>
                <td class="p-4 text-gray-600 italic">Publicó una nueva oferta laboral</td>
                <td class="p-4"><span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Ofertas</span></td>
                <td class="p-4 text-gray-500">22 mar · 09:14</td>
                <td class="p-4"><span class="text-green-600 font-bold text-xs flex items-center gap-1">● Aprobado</span></td>
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
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // 1. Aquí podrías limpiar el localStorage o cookies de sesión en el futuro
  // localStorage.removeItem('token'); 

  // 2. Redirigir a la vista de Inicio de Sesión
  router.push({ name: 'InicioSesion' }); 
};
</script>
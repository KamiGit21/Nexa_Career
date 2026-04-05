<template>
  <aside class="w-64 bg-[#1e293b] text-white flex flex-col min-h-screen">
    <div class="p-6 text-center">
      <h1 class="text-xl font-bold text-yellow-500">Nexa Careers</h1>
      <p class="text-xs text-gray-400">Panel de Control</p>
    </div>

    <nav class="flex-1 mt-4">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.path" 
            :class="['px-4 py-3 hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-3', 
                    $route.path === item.path ? 'bg-yellow-600/20 border-l-4 border-yellow-500' : '']">
          <router-link :to="item.path" class="flex items-center justify-between w-full p-2 rounded-lg">
            <div class="flex items-center gap-3">
              <span>{{ item.icon }}</span>
              <span>{{ item.text }}</span>
            </div>
            <span v-if="item.count" class="text-xs bg-slate-600 px-2 py-0.5 rounded">{{ item.count }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';


const props = defineProps({
  stats: {
    type: Object,
    default: () => ({ empleadores: 0, estudiantes: 0 })
  }
});

const menuItems = computed(() => [
  { path: '/dashboard-supervisor', text: 'Panel Principal', icon: '📊' },
  { path: '/ofertas', text: 'Ofertas Laborales', icon: '🏢' },
  {path: '/cursos', text: 'Catalogo Cursos', icon: '👥'},
  { path: '#', text: 'Estudiantes', icon: '🎓', count: props.stats.estudiantes },
  { path: '#', text: 'Empleadores', icon: '💻', count: props.stats.empleadores },
  { path: '#', text: 'Supervisores', icon: '👨‍💼' },
  { path: '/registro-supervisor', text: 'Registrar Supervisor', icon: '📋' },
  
]);
</script>
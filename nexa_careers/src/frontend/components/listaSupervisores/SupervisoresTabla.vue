<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
    <table class="w-full text-sm">
      <thead class="bg-[#1e293b] text-white">
        <tr>
          <th class="p-4 text-left font-semibold">Supervisor</th>
          <th class="p-4 text-left font-semibold">Correo</th>
          <th class="p-4 text-center font-semibold">Teléfono</th>
          <th class="p-4 text-center font-semibold">Estado</th>
          <th class="p-4 text-center font-semibold">Fecha de registro</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="s in supervisores" :key="s.id_supervisor" class="hover:bg-gray-50 transition-colors">
          <td class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {{ obtenerIniciales(s.nombre, s.apellido) }}
              </div>
              <div>
                <p class="font-semibold text-slate-700">{{ s.nombre }} {{ s.apellido }}</p>
                <p class="text-xs text-gray-400">ID #{{ s.id_supervisor }}</p>
              </div>
            </div>
          </td>
          <td class="p-4 text-xs text-gray-600">{{ s.gmail }}</td>
          <td class="p-4 text-center text-gray-600">{{ s.telefono || '—' }}</td>
          <td class="p-4 text-center">
            <UsuarioEstadoBadge :activo="s.activo !== undefined ? s.activo : true" />
          </td>
          <td class="p-4 text-center text-xs text-gray-400">{{ formatearFecha(s.creado_en) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="supervisores.length === 0" class="text-center py-12 text-gray-400">
      No se encontraron supervisores.
    </div>
  </div>
</template>

<script setup>
import UsuarioEstadoBadge from '../adminUsuarios/UsuarioEstadoBadge.vue'

defineProps({ 
  supervisores: { type: Array, required: true } 
})

//Funcion para obtener iniciales
const obtenerIniciales = (nombre, apellido) => {
  const n = (nombre || '').trim().charAt(0);
  const a = (apellido || '').trim().charAt(0);
  return (n + a).toUpperCase() || '??';
}

const formatearFecha = (f) => {
  if (!f) return '—'
  const fecha = new Date(f)
  
  if (isNaN(fecha.getTime())) return '—'
  return fecha.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}
</script>
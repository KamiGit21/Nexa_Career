<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <navbar/>

    <header class="bg-[#1e293b] text-white py-16 px-8 text-center border-t border-slate-700">
      <h1 class="text-4xl font-extrabold mb-4">Encuentra tu próximo desafío profesional</h1>
      <p class="text-slate-400 max-w-2xl mx-auto mb-8">
        Explora las mejores oportunidades laborales en tecnología, diseño y negocios dentro de la red Nexa.
      </p>
      
      <div class="max-w-3xl mx-auto bg-white p-2 rounded-xl shadow-2xl flex flex-wrap md:flex-nowrap gap-2">
        <div class="flex-1 flex items-center px-4 gap-2 border-r border-gray-100">
          <span class="text-gray-400">🔍</span>
          <input type="text" placeholder="Cargo, empresa o palabra clave" class="w-full py-3 text-slate-800 outline-none text-sm">
        </div>
        <div class="flex-1 flex items-center px-4 gap-2">
          <span class="text-gray-400">📍</span>
          <select class="w-full py-3 text-slate-800 outline-none text-sm bg-transparent">
            <option>Todas las ubicaciones</option>
            <option>Remoto</option>
            <option>La Paz, Bolivia</option>
          </select>
        </div>
        <button class="bg-[#1e293b] text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
          Buscar
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-12 px-8 flex gap-8">
      
      <aside class="w-64 hidden lg:block">
        <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>⚙️</span> Filtrar por
        </h3>
        
        <div class="space-y-8">
          <div>
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Categoría</h4>
            <div class="space-y-2">
              <label v-for="cat in ['Tecnología', 'Diseño', 'Marketing', 'Finanzas']" :key="cat" class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                <input type="checkbox" class="rounded border-gray-300 text-[#1e293b] focus:ring-[#1e293b]"> {{ cat }}
              </label>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Modalidad</h4>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded border-gray-300"> Remoto</label>
              <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded border-gray-300"> Presencial</label>
              <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="rounded border-gray-300"> Híbrido</label>
            </div>
          </div>
        </div>
      </aside>

      <section class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <p class="text-sm text-gray-500 font-medium">Mostrando <span class="text-slate-800 font-bold">24 ofertas</span> activas</p>
          <select class="bg-transparent text-sm font-semibold text-slate-700 outline-none">
            <option>Más recientes</option>
            <option>Relevancia</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                <!-- <img src="@/frontend/assets/images/hero.png" class="w-full h-full object-cover opacity-80" alt="Logo Empresa"> -->
              </div>
              <span class="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-1 rounded uppercase">Nuevo</span>
            </div>
            
            <h2 class="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Desarrollador Backend Senior</h2>
            <p class="text-sm text-yellow-600 font-semibold mb-3">Nexa IT Solutions</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">📍 La Paz / Remoto</span>
              <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">🕒 Tiempo Completo</span>
            </div>

            <p class="text-xs text-gray-500 line-clamp-2 mb-6">
              Buscamos un experto en Node.js y arquitecturas de microservicios para liderar el desarrollo de nuestras plataformas...
            </p>

            <div class="flex justify-between items-center pt-4 border-t border-gray-50">
              <span class="text-xs text-gray-400 font-medium italic">Publicado hace 2 días</span>
              <button class="text-[#1e293b] font-bold text-sm hover:underline flex items-center gap-1">
                Ver detalle <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-12 flex justify-center gap-2">
          <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400">←</button>
          <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1e293b] text-white font-bold">1</button>
          <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-slate-600">2</button>
          <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-slate-600">→</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
  import Navbar from '@/components/layout/Navbar.vue'
</script>
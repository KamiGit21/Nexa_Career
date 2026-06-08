<template>
  <div class="flex justify-between items-end mb-8">
    <div>
      <h1 class="text-4xl font-bold text-[#1b2a4a]">Mis Ofertas Favoritas</h1>
      <p class="text-gray-500 mt-1">Ofertas laborales que has guardado para revisar o postularte</p>
    </div>
    <router-link
      to="/ofertas"
      class="px-6 py-3 bg-[#1b2a4a] text-white rounded-2xl font-medium flex items-center gap-2 hover:bg-[#0f1a2e] transition-colors"
    >
      🔍 Explorar Ofertas
    </router-link>
  </div>
</template>
<template>
  <div v-if="mostrarArriba || mostrarAbajo" class="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
    <button 
      v-show="mostrarArriba"
      @click="scrollToTop"
      class="p-3 bg-[#1b2a4a] text-white rounded-full shadow-lg hover:bg-[#2c4373] transition-all duration-300 flex items-center justify-center"
      title="Ir arriba"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>

    <button 
      v-show="mostrarAbajo"
      @click="scrollToBottom"
      class="p-3 bg-[#1b2a4a] text-white rounded-full shadow-lg hover:bg-[#2c4373] transition-all duration-300 flex items-center justify-center"
      title="Ir abajo"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mostrarArriba = ref(false)
const mostrarAbajo = ref(true)

const checkScroll = () => {
  mostrarArriba.value = window.scrollY > 300
  const elementoFinal = document.getElementById('punto-final');
  if (elementoFinal) {
    const rect = elementoFinal.getBoundingClientRect();
    mostrarAbajo.value = rect.top > window.innerHeight;
  } else {
    const cercaDelFinal = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 150;
    mostrarAbajo.value = !cercaDelFinal;
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  const elemento = document.getElementById('punto-final');
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'end' });
  } else {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
  checkScroll(); 
})
onUnmounted(() => window.removeEventListener('scroll', checkScroll))
</script>
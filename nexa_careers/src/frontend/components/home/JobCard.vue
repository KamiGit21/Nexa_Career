<template>
  <div class="bg-white rounded-[25px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-5 flex flex-col justify-between h-[268px] hover:scale-105 transition-transform cursor-pointer" @click="verMas">
    <div>
      <h3 class="font-semibold text-[#002349] text-[25px] leading-tight">{{ job.title }}</h3>
      <p class="text-[#545454] text-xl mt-2">{{ job.company }}</p>
      <div class="mt-3 text-[#545454] text-xl">
        Categorías:<br>
        <span v-for="cat in job.categories" :key="cat" class="inline-block mr-2">{{ cat }}</span>
      </div>
    </div>
    <button class="w-full h-[45px] bg-[#002349] rounded-[15px] text-[#d0b06d] text-[22px] font-semibold hover:bg-[#003366]">
      Ver más
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({ job: Object })
const emit = defineEmits(['ver-mas'])
const verMas = () => emit('ver-mas', props.job)
</script>
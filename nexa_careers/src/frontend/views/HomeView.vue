<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CategoryGrid from '@/components/home/CategoryGrid.vue'
import JobList from '@/components/home/JobList.vue'
</script>

<template>
  <div class="home">
    <Navbar />
    <HeroSection />
    <CategoryGrid />
    <JobList />
  </div>
</template>

<style src="@/assets/styles/home.css"></style>

//actualizar despues
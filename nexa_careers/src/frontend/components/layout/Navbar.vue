<template>
  <nav class="navbar">
    <div class="logo">Nexa Careers</div>

    <div class="menu">
      <span class="search">🔍 Buscar</span>
      <a href="#">Home</a>
      <div class="avatar">👤</div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: #0d2b4d;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 15px 40px;
  align-items: center;
}

.menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.avatar {
  background: white;
  color: #0d2b4d;
  border-radius: 50%;
  padding: 8px;
}
</style>
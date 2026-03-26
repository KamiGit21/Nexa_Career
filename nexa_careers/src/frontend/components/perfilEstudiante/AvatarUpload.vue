<template>
  <div class="avatar">
    <div class="circle">AM</div>
    <button class="camera">📷</button>
    <p>Cambiar foto</p>
  </div>
</template>

<style scoped>
.avatar {
  text-align: center;
  margin-bottom: 20px;
}

.circle {
  width: 80px;
  height: 80px;
  background: #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.camera {
  margin-top: -20px;
}
</style>
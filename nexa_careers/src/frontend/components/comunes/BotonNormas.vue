<template>
    <div class="fixed-bottom-left">
        <button @click="showModal = true" class="btn-normas" title="Normas de la Comunidad">
            <i class="fas fa-gavel"></i> <strong>⌛ Normas</strong>
        </button>

        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Normas de la Comunidad - Nexa Careers</h3>
                    <button @click="showModal = false" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <iframe src="https://drive.google.com/file/d/1XBDxUaSyeMJ_3zicK7QsC1UdD7YoSWaz/preview" type="application/pdf"
                        width="100%" height="600px" frameborder="0">
                    </iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const showModal = ref(false);
</script>

<style scoped>
.fixed-bottom-left {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
}

.btn-normas {
    background-color: white;
    color: #cfab5d;
    padding: 10px 15px;
    border-radius: 50px;
    border: none;   
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    border: 2px solid #cfab5d;
}

.btn-normas:hover {
    transform: scale(1.05);
    background-color: #1B2A4A;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: #1B2A4A;
    color: white;
    width: 80%;
    max-width: 800px;
    border-radius: 8px;
    overflow: hidden;
}

.modal-header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1B2A4A;
    border-bottom: 1px solid #e2e8f0;
}

.close-btn {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
}

.modal-body {
    padding: 0;
}
</style>
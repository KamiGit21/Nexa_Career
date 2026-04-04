<template>
    <div class="quick-action-card" :style="{ borderTop: `6px solid ${borderColor}` }">
        <div class="card-header">
            <div class="icon-container">
                <img :src="iconName" :alt="title" class="action-image-icon" />
            </div>
            <h4 class="action-title" v-html="title"></h4>
        </div>

        <div class="card-body">
            <p class="action-description">{{ description }}</p>
            <button class="btn-action" :style="{ backgroundColor: borderColor }" @click="$emit('action-click')">
                {{ buttonText }}
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    iconName: String,
    title: String,
    description: String,
    buttonText: String,
    borderColor: {
        type: String,
        default: '#e2e8f0'
    }
});
defineEmits(['action-click']);
</script>

<style scoped>
.action-image-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.quick-action-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0 0 8px 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: all 0.3s ease;
}

.icon-container {
    background-color: #eff6ff;
    padding: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quick-action-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.action-title {
    font-weight: 700;
    font-size: 14px;
    color: #1e293b;
}

.btn-action {
    background-color: #1e293b;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: auto;
}

.card-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.action-description {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 16px;
    flex-grow: 1;
}

.btn-action:hover {
    background-color: #0f172a;
}
</style>
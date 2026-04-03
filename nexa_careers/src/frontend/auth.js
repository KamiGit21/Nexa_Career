import { reactive } from 'vue';

export const authState = reactive({
    rol: null,
    email: null,
    id: null,

    actualizarSesion() {
        const data = JSON.parse(localStorage.getItem('sesion') || '{}');
        this.rol = data.rol || null;
        this.email = data.email || null;
        this.id = data.id || null;
    },

    logout() {
        localStorage.removeItem('sesion');
        this.rol = null;
        this.email = null;
        this.id = null;
    }
});
authState.actualizarSesion();
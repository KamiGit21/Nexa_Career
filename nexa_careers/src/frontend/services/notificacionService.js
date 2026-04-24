const API_URL = 'http://localhost:3000/api';

export const crearCodigo = async () => {
    const codigo = Math.random().toString(10).substring(2, 6);
    return codigo;
}
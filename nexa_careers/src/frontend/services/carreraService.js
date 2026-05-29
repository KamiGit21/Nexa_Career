// src/frontend/services/carreraService.js
const API_URL = 'http://localhost:3000/api';

export const obtenerCarreraPorId = async (id) => {
  try {
    const res = await fetch(`${API_URL}/carreras/${id}`);
    return await res.json();
  } catch (error) {
    console.error(`Error en obtenerCarreraPorId (ID: ${id}):`, error);
    return { success: false, message: error.message };
  }
};
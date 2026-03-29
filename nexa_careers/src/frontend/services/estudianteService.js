// src/frontend/services/estudianteService.js
const API_URL = 'http://localhost:3000/api';

export const registrarEstudiante = async (data) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en registrarEstudiante:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerEstudiantePorId = async (id) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerEstudiantePorId:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerEstudiantePorGmail = async (gmail) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/gmail/${encodeURIComponent(gmail)}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerEstudiantePorGmail:', error);
    return { success: false, message: error.message };
  }
};

export const actualizarPerfilEstudiante = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}/perfil`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en actualizarPerfilEstudiante:', error);
    return { success: false, message: error.message };
  }
};

export const cambiarContrasenaEstudiante = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}/contrasena`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en cambiarContrasenaEstudiante:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerPostulacionesPorEstudiante = async (id) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}/postulaciones`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerPostulacionesPorEstudiante:', error);
    return { success: false, message: error.message };
  }
};
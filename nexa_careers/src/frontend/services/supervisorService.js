// src/frontend/services/supervisorService.js
const API_URL = 'http://localhost:3000/api';

export const registrarSupervisor = async (data) => {
  try {
    const res = await fetch(`${API_URL}/supervisores/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en registrarSupervisor:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerSupervisorPorId = async (id) => {
  try {
    const res = await fetch(`${API_URL}/supervisores/${id}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerSupervisorPorId:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerSupervisorPorGmail = async (gmail) => {
  try {
    const res = await fetch(`${API_URL}/supervisores/gmail/${encodeURIComponent(gmail)}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerSupervisorPorGmail:', error);
    return { success: false, message: error.message };
  }
};

export const actualizarPerfilSupervisor = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/supervisores/${id}/perfil`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en actualizarPerfilSupervisor:', error);
    return { success: false, message: error.message };
  }
};

export const cambiarContrasenaSupervisor = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/supervisores/${id}/contrasena`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en cambiarContrasenaSupervisor:', error);
    return { success: false, message: error.message };
  }
};
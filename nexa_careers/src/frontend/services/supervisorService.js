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

export const obtenerEstadisticasDashboard = async () => {
  try {
   
    const [estudiantesRes, empleadoresRes, ofertasRes, cursosRes] = await Promise.all([
      fetch(`${API_URL}/estudiantes`),
      fetch(`${API_URL}/empleadores`),
      fetch(`${API_URL}/ofertas`),
      fetch(`${API_URL}/cursos`)
    ]);

    // Convertimos a JSON
    const estudiantesData = await estudiantesRes.json();
    const empleadoresData = await empleadoresRes.json();
    const ofertasData = await ofertasRes.json();
    const cursosData = await cursosRes.json();

    // Contador de registros en cada array
    const totalEstudiantes = estudiantesData.success && estudiantesData.data ? estudiantesData.data.length : 0;
    const totalEmpleadores = empleadoresData.success && empleadoresData.data ? empleadoresData.data.length : 0;
    const totalOfertas = ofertasData.success && ofertasData.data ? ofertasData.data.length : 0;
    const totalCursos = cursosData.success && cursosData.data ? cursosData.data.length : 0;

    return { 
      success: true, 
      metricas: {
        estudiantes: totalEstudiantes,
        empleadores: totalEmpleadores,
        ofertas: totalOfertas,
        cursos: totalCursos
      },
      // Devolvemos un array vacío por ahora para la tabla, o puedes simular datos
      recientes: [] 
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return { 
      success: false, 
      metricas: {estudiantes:0, empleadores: 0, ofertas: 0, cursos: 0 },
      recientes: []
    };
  }
};
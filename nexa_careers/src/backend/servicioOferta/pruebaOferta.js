// src/backend/servicioOferta/pruebaOferta.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ofertas';

async function ejecutarPruebas() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Ofertas...\n');

    // 1. POST: Crear oferta
    console.log('➡️ 1. Ejecutando POST: Creando nueva oferta...');
    const postResponse = await axios.post(`${API_URL}/crear`, { 
      descripcion: 'Buscamos desarrollador Vue.js Junior',
      fecha_apertura: '2026-04-01', // Formato YYYY-MM-DD
      oferta: 'Desarrollador Frontend Vue',
      id_empleador: 1 // <- OJO: Debe existir un empleador con ID 1 en tu BD
    });
    const nuevoId = postResponse.data.id_oferta;
    console.log('✅ Resultado:', postResponse.data);
    console.log('--------------------------------------------------\n');

    // 2. GET: Listar todas
    console.log('➡️ 2. Ejecutando GET: Solicitando todas las ofertas...');
    const getResponse = await axios.get(API_URL);
    console.table(getResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 3. GET: Buscar por empleador
    console.log('➡️ 3. Ejecutando GET: Buscando ofertas del empleador ID 1...');
    const empleadorResponse = await axios.get(`${API_URL}/empleador/1`);
    console.log('✅ Resultado:', empleadorResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 4. PUT: Editar oferta (Sin tocar el estado)
    console.log(`➡️ 4. Ejecutando PUT: Editando detalles de la oferta ID ${nuevoId}...`);
    const putEditarResponse = await axios.put(`${API_URL}/${nuevoId}/editar`, {
      descripcion: 'Buscamos desarrollador Vue.js Semi-Senior',
      fecha_apertura: '2026-04-15',
      oferta: 'Desarrollador Frontend Vue (Semi-Senior)',
      rechazo: 'Aún en proceso de selección' // Simulando que se llenó este campo luego
    });
    console.log('✅ Resultado:', putEditarResponse.data);
    console.log('--------------------------------------------------\n');

    // 5. PUT: Cambiar estado
    console.log(`➡️ 5. Ejecutando PUT: Cambiando estado de la oferta ID ${nuevoId} a 1 (Aprobada)...`);
    const putEstadoResponse = await axios.put(`${API_URL}/${nuevoId}/estado`, {
      estado: 1 // Asumiendo que 1 significa "Aprobada/Activa"
    });
    console.log('✅ Resultado:', putEstadoResponse.data);
    console.log('--------------------------------------------------\n');

    // 6. GET: Listar ofertas pendientes
    console.log('➡️ 6. Ejecutando GET: Solicitando ofertas pendientes...');
    const pendientesResponse = await axios.get(`${API_URL}/pendientes`);
    console.log('✅ Resultado:', pendientesResponse.data);
    console.log('--------------------------------------------------\n');

    // 7. PUT: Cambiar estado a rechazado
    console.log(`➡️ 7. Ejecutando PUT: Cambiando estado de la oferta ID ${nuevoId} a 2 (Rechazada)`);
    const putRechazarResponse = await axios.put(`${API_URL}/${nuevoId}/estado`, {
      estado: 2 // Rechazada
    });
    console.log('✅ Resultado:', putRechazarResponse.data);
    console.log('--------------------------------------------------\n');

    // 8. PUT: Cambiar estado a pendiente nuevamente
    console.log(`➡️ 8. Ejecutando PUT: Cambiando estado de la oferta ID ${nuevoId} a 0 (Pendiente)`);
    const putPendienteResponse = await axios.put(`${API_URL}/${nuevoId}/estado`, {
      estado: 0 // Pendiente
    });
    console.log('✅ Resultado:', putPendienteResponse.data);
    
    console.log('\n Todas las pruebas de ofertas finalizaron con éxito.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response ? error.response.data : error.message);
  }
}

ejecutarPruebas();
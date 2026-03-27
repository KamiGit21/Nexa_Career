// src/backend/servicioOfertante/pruebaOfertante.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ofertantes';

async function ejecutarPruebas() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Ofertantes (Postulaciones)...\n');

    // 1. POST: Crear postulación
    console.log('➡️ 1. Ejecutando POST: El estudiante 1 se postula a la oferta 1...');
    const postResponse = await axios.post(`${API_URL}/postular`, { 
      id_oferta: 1,
      id_estudiante: 1
    });
    const nuevoId = postResponse.data.id_ofertante;
    console.log('✅ Resultado:', postResponse.data);
    console.log('--------------------------------------------------\n');

    // 2. GET: Buscar por ID de postulación
    console.log(`➡️ 2. Ejecutando GET: Solicitando la postulación ID ${nuevoId}...`);
    const getResponse = await axios.get(`${API_URL}/${nuevoId}`);
    console.log('✅ Resultado:', getResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 3. GET: Buscar postulantes por Oferta
    console.log('➡️ 3. Ejecutando GET: Buscando postulantes de la oferta ID 1...');
    const ofertaResponse = await axios.get(`${API_URL}/oferta/1`);
    console.table(ofertaResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 4. GET: Buscar postulaciones de un Estudiante
    console.log('➡️ 4. Ejecutando GET: Buscando postulaciones del estudiante ID 1...');
    const estudianteResponse = await axios.get(`${API_URL}/estudiante/1`);
    console.table(estudianteResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 5. PUT: Cambiar estado de la postulación (0: Pendiente, 1: Aceptado, 2: Rechazado)
    console.log(`➡️ 5. Ejecutando PUT: Cambiando estado de la postulación ID ${nuevoId} a 1 (Aceptado)...`);
    const putEstadoResponse = await axios.put(`${API_URL}/${nuevoId}/estado`, {
      estado: 1 
    });
    console.log('✅ Resultado:', putEstadoResponse.data);
    console.log('\n🎉 Todas las pruebas de ofertantes finalizaron con éxito.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response ? error.response.data : error.message);
  }
}

ejecutarPruebas();
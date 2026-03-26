// src/backend/api-gateway/pruebaGateway.js
import axios from 'axios';

// 🌐 Apuntamos AL GATEWAY (Puerto 3000), no a los microservicios directamente
const GATEWAY_URL = 'http://localhost:3000/api';

async function probarGateway() {
  try {
    console.log('⏳ Iniciando prueba del API Gateway...\n');
    /*const postcarrera = await axios.post(`${GATEWAY_URL}/carreras/registrar`, { 
      carrera: 'Psicologia' 
    });*/
    // 1. Pedir todas las carreras al Gateway
    console.log('➡️ 1. Pidiendo /api/carreras al Gateway...');
    const carrerasResponse = await axios.get(`${GATEWAY_URL}/carreras`);
    
    console.log('✅ Respuesta recibida (Carreras):');
    if (carrerasResponse.data.success && carrerasResponse.data.data.length > 0) {
      console.table(carrerasResponse.data.data);
    } else {
      console.log('No hay carreras registradas o hubo un problema.');
    }
    console.log('--------------------------------------------------\n');

    // 2. Pedir todos los estudiantes al Gateway
    console.log('➡️ 2. Pidiendo /api/estudiantes al Gateway...');
    const estudiantesResponse = await axios.get(`${GATEWAY_URL}/estudiantes`);
    
    console.log('✅ Respuesta recibida (Estudiantes):');
    if (estudiantesResponse.data.success && estudiantesResponse.data.data.length > 0) {
      console.table(estudiantesResponse.data.data);
    } else {
      console.log('No hay estudiantes registrados o hubo un problema.');
    }
    console.log('\n🎉 ¡El API Gateway está enrutando el tráfico perfectamente!');

  } catch (error) {
    console.error('❌ Error de conexión con el Gateway:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

probarGateway();
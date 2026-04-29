import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const correosPrueba = {
  estudiante: 'santiago.torez@ucb.edu.bo',       // Pon un gmail de la tabla estudiante
  empleador: 'santiago.m.torrez.latorre@gmail.com',   // Pon un gmail de la tabla empleador (ej. el del ID 1)
  //supervisor: 'admin@nexacareers.com'        // Pon un gmail de la tabla supervisor
};

// Generamos un código falso de 6 dígitos para la prueba
const codigoFalso = '123456';

const testEnviarCodigo = async (rol, urlParcial, correo) => {
  console.log(`\n⏳ [${rol.toUpperCase()}] Probando envío a: ${correo}...`);
  try {
    // Apuntamos a /enviarCodigo (en camelCase, tal como lo tienes en tus rutas)
    const url = `${API_URL}/${urlParcial}/enviarCodigo`;
    console.log(`   📍 Ruta: POST ${url}`);

    const response = await axios.post(url, {
      correo: correo,
      codigo: codigoFalso
    });

    console.log(`   ✅ ¡Éxito! Respuesta:`, response.data.message);
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de error (400, 404, 500)
      console.error(`   ❌ Falló (Error ${error.response.status}):`, error.response.data.message);
    } else {
      // El servidor está apagado o no se puede alcanzar
      console.error(`   🛑 Error de red crítico:`, error.message);
    }
  }
};

const ejecutarPruebas = async () => {
  console.log('🚀 Iniciando batería de pruebas de Microservicios de Correo...\n');
  
  await testEnviarCodigo('Estudiante', 'estudiantes', correosPrueba.estudiante);
  await testEnviarCodigo('Empleador', 'empleadores', correosPrueba.empleador);
  // await testEnviarCodigo('Supervisor', 'supervisores', correosPrueba.supervisor);
  
  console.log('\n🏁 Pruebas finalizadas.');
  process.exit(0);
};

ejecutarPruebas();
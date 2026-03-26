import axios from 'axios';
const API_URL = 'http://localhost:3002/api/carreras';

async function cargarCarreras() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Carreras...\n');

    // Registrar carreras 
  
   console.log('➡️ Ejecutando POST: Registrando ""...');
    const postResponse = await axios.post(`${API_URL}/registrar`, { 
      carrera: 'Ingenieria Sistemas' 
    });
    const postResponse1 = await axios.post(`${API_URL}/registrar`, { 
      carrera: 'Administracion de Empresas' 
    });
    const postResponse2 = await axios.post(`${API_URL}/registrar`, { 
      carrera: 'Ingenieria Industrial' 
    });
    const postResponse3 = await axios.post(`${API_URL}/registrar`, { 
      carrera: 'Ingenieria Mecatronica' 
    });
    
    console.log('--------------------------------------------------\n'); 
    
      
   
    console.log('➡️ Ejecutando GET: Solicitando lista de carreras...');
    const getResponse = await fetch(API_URL);
    const getData = await getResponse.json();

    console.log('✅ Resultado del GET (Lista completa):');
    if (getData.success && getData.data.length > 0) {
      console.table(getData.data); 
    } else {
      console.log(getData);
    }
    
   
    
   
    
    console.log('\n🎉 Carga finalizada.');

  } catch (error) {
    console.error('❌ Error durante la ejecución', error);
  }
}

cargarCarreras();
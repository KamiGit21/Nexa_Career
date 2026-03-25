// 👉 ¡Aquí está la corrección! Asegúrate de que empiece con "const"
import axios from 'axios';
const API_URL = 'http://localhost:3002/api/carreras';

async function ejecutarPruebas() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Carreras...\n');

    // 1. Registrar una nueva carrera (POST)
   
   console.log('➡️ Ejecutando POST: Registrando "Economia"...');
     const postResponse = await axios.post(`${API_URL}/registrar`, { 
      carrera: 'Medicina' 
    });
    
     console.log('✅ Resultado del POST:', postResponse.data);
     console.log('--------------------------------------------------\n');
    
      
    // 2. Obtener la lista de todas las carreras (GET)
    console.log('➡️ Ejecutando GET: Solicitando lista de carreras...');
    const getResponse = await fetch(API_URL);
    const getData = await getResponse.json();

    console.log('✅ Resultado del GET (Lista completa):');
    if (getData.success && getData.data.length > 0) {
      console.table(getData.data); 
    } else {
      console.log(getData);
    }
    
    // 3. Buscar carrera por nombre (GET con Query Params)
    const terminoBusqueda = 'Economia'; // Palabra clave a buscar
    console.log(`➡️ Ejecutando GET: Buscando carreras que contengan "${terminoBusqueda}"...`);
    
    // Le añadimos el /buscar?nombre= al final de la URL
    const searchResponse = await fetch(`${API_URL}/buscar?nombre=${terminoBusqueda}`);
    const searchData = await searchResponse.json();

    console.log(`✅ Resultado de la Búsqueda por "${terminoBusqueda}":`);
    if (searchData.success && searchData.data.length > 0) {
      console.table(searchData.data); 
    } else {
      console.log(`No se encontraron carreras con el nombre "${terminoBusqueda}".`);
    }
    
    console.log('\n🎉 Pruebas finalizadas con éxito.');

  } catch (error) {
    console.error('❌ Error durante la ejecución de las pruebas:', error);
  }
}

ejecutarPruebas();
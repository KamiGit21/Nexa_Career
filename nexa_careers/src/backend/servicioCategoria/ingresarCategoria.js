import axios from 'axios';
const API_URL = 'http://localhost:3009/api/categorias';

async function cargarCategorias() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Categorías...\n');

    // Registrar categorías
    console.log('➡️ Ejecutando POST: Registrando categorías...');
    const postResponse = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Tecnología e Informática'
    });
    const postResponse1 = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Administración y Negocios'
    });
    const postResponse2 = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Marketing y Ventas'
    });
    const postResponse3 = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Diseño y Creatividad'
    });
    const postResponse4 = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Educación y Capacitación'
    });
    const postResponse5 = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Salud y Bienestar'
    });
    const postResponse6 = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Ingeniería'
    });
    const postResponse7 = await axios.post(`${API_URL}/registrar`, {
      categoria: 'Finanzas y Contabilidad'
    });

    console.log('--------------------------------------------------\n');

    console.log('➡️ Ejecutando GET: Solicitando lista de categorías...');
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

cargarCategorias();
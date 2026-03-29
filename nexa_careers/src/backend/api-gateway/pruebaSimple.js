import axios from 'axios';

async function pruebaSimple() {
  try {
    console.log('Probando gateway en http://localhost:3000/api/estudiantes');
    const response = await axios.get('http://localhost:3000/api/estudiantes');
    console.log(' Respuesta:', response.data);
  } catch (error) {
    console.error(' Error:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
  }
}

pruebaSimple();
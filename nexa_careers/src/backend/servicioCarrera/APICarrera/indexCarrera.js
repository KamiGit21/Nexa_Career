// Inicializar con el comando "node indexCarrera.js" para levantar el microservicio de carreras

import express from 'express';
import cors from 'cors';

const app = express();

// Importar rutas 
import carreraRoutes from './carreraRoutes.js';

app.use(cors());
app.use(express.json());

// Rutas con prefijo /api/carreras
app.use('/api/carreras', carreraRoutes);

// Puerto del microservicio
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Carreras corriendo en http://localhost:${PORT}`);
});
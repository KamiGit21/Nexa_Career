// Inicializar con el comando "node indexCategoria.js" para levantar el microservicio de categorías

import express from 'express';
import cors from 'cors';

const app = express();

// Importar rutas
import categoriaRoutes from './categoriaRoutes.js';

app.use(cors());
app.use(express.json());

// Rutas con prefijo /api/categorias
app.use('/api/categorias', categoriaRoutes);

// Puerto del microservicio
const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Categorías corriendo en http://localhost:${PORT}`);
});
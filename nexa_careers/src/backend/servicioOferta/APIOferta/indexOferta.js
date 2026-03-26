// Inicializar con el comando "node indexOferta.js" para levantar el microservicio de ofertas

import express from 'express';
const app = express();

// Importar rutas
import ofertaRoutes from './ofertaRoutes.js';
app.use(express.json());

// Rutas con prefijo /api/ofertas
app.use('/api/ofertas', ofertaRoutes);

// Puerto del microservicio
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`🚀 Microservicio de Ofertas corriendo en http://localhost:${PORT}`);
});
// Inicializar con el comando "node indexOfertante.js" para levantar el microservicio de ofertante

import express from 'express';
const app = express();

// Importar rutas
import ofertanteRoutes from './ofertanteRoutes.js';
app.use(express.json());

// Rutas con prefijo /api/ofertante
app.use('/api/ofertante', ofertanteRoutes);

// Puerto del microservicio
const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
    console.log(`🚀 Microservicio de Ofertante corriendo en http://localhost:${PORT}`);
});
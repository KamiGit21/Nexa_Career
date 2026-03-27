// src/backend/servicioOferta/APIOferta/indexOferta.js
import express from 'express';
import ofertaRoutes from './ofertaRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/ofertas', ofertaRoutes);

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Ofertas corriendo en http://localhost:${PORT}`);
});
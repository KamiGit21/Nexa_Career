// src/backend/servicioOfertante/APIOfertante/indexOfertante.js
import express from 'express';
import ofertanteRoutes from './ofertanteRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/ofertantes', ofertanteRoutes);

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Ofertantes corriendo en http://localhost:${PORT}`);
});
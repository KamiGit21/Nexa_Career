import express from 'express';
import supervisorRoutes from './supervisorRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/supervisores', supervisorRoutes);

// Usamos el puerto 3005 para no chocar con los otros
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Supervisores corriendo en http://localhost:${PORT}`);
});
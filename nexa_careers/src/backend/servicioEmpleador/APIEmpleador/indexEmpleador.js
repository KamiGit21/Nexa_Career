import express from 'express';
import empleadorRoutes from './empleadorRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/empleadores', empleadorRoutes);

// Usamos el puerto 3004 para el servicio de empleadores
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Empleadores corriendo en http://localhost:${PORT}`);
});
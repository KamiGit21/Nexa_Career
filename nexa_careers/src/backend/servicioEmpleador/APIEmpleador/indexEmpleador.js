import express from 'express';
import empleadorRoutes from './empleadorRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/empleadores', empleadorRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Empleadores corriendo en http://localhost:${PORT}`);
});
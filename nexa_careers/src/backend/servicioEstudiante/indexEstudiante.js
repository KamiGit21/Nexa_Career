import express from 'express';
import estudianteRoutes from './estudianteRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/estudiantes', estudianteRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Estudiantes corriendo en http://localhost:${PORT}`);
});
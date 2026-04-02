import express from 'express';
import cors from 'cors';

const app = express();

// Importar rutas 
import cursoRoutes from './cursoRoutes.js';

app.use(cors());
app.use(express.json());

// Rutas con prefijo /api/cursos
app.use('/api/cursos', cursoRoutes);

// Puerto del microservicio
const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Cursos corriendo en http://localhost:${PORT}`);
});
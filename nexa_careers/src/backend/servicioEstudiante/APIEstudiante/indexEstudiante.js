import express from 'express';
import cors from 'cors';  // ← Importar cors
import estudianteRoutes from './estudianteRoutes.js';
import cvRoutes from './cvRoutes.js';

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());  // ← Agregar esta línea

// Middleware para loggear todas las peticiones
app.use((req, res, next) => {
  console.log(`📥 [Estudiante Service] ${req.method} ${req.url}`);
  console.log(`   Headers: ${req.headers['content-type']}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montar rutas
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/estudiantes', cvRoutes);

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`📚 Servicio de Estudiantes corriendo en puerto ${PORT}`);
  console.log(`   Rutas de CV disponibles:`);
  console.log(`   POST   /api/estudiantes/:id/cv/upload`);
  console.log(`   GET    /api/estudiantes/:id/cv/ver`);
  console.log(`   GET    /api/estudiantes/:id/cv/info`);
  console.log(`   DELETE /api/estudiantes/:id/cv`);
});
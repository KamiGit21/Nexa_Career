import express from 'express';
import cors from 'cors';

const app = express();

console.log('Iniciando API Gateway...');

app.use(cors());
app.use(express.json());

// Log todas las peticiones
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Función helper para hacer proxy
const createProxy = (targetUrl) => async (req, res) => {
  try {
    const fullUrl = `${targetUrl}${req.originalUrl}`;
    console.log(`🔄 Redirigiendo ${req.method} ${req.originalUrl} a: ${fullUrl}`);
    
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      options.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(fullUrl, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`❌ Error proxy a ${targetUrl}:`, error.message);
    res.status(500).json({ 
      error: 'Error al conectar con el microservicio', 
      message: error.message,
      target: targetUrl
    });
  }
};

// Servicio de Carreras (puerto 3002)
app.get('/api/carreras', createProxy('http://localhost:3002'));
app.get('/api/carreras/:id', createProxy('http://localhost:3002'));
app.post('/api/carreras/registrar', createProxy('http://localhost:3002'));

// Servicio de Estudiantes (puerto 3003)
app.get('/api/estudiantes', createProxy('http://localhost:3003'));
app.get('/api/estudiantes/:id', createProxy('http://localhost:3003'));
app.get('/api/estudiantes/gmail/:gmail', createProxy('http://localhost:3003'));
app.post('/api/estudiantes/registrar', createProxy('http://localhost:3003'));
app.put('/api/estudiantes/:id/perfil', createProxy('http://localhost:3003'));
app.put('/api/estudiantes/:id/contrasena', createProxy('http://localhost:3003'));
app.put('/api/estudiantes/:id/estado', createProxy('http://localhost:3003'));
app.get('/api/estudiantes/:id/postulaciones', createProxy('http://localhost:3003'));

// Servicio de Empleadores (puerto 3004)
app.get('/api/empleadores', createProxy('http://localhost:3004'));
app.get('/api/empleadores/:id', createProxy('http://localhost:3004'));
app.get('/api/empleadores/gmail/:gmail', createProxy('http://localhost:3004'));
app.post('/api/empleadores/registrar', createProxy('http://localhost:3004'));
app.put('/api/empleadores/:id/perfil', createProxy('http://localhost:3004'));
app.put('/api/empleadores/:id/contrasena', createProxy('http://localhost:3004'));
app.put('/api/empleadores/:id/estado', createProxy('http://localhost:3004'));

// Servicio de Supervisores (puerto 3005)
app.post('/api/supervisores/registrar', createProxy('http://localhost:3005'));
app.get('/api/supervisores', createProxy('http://localhost:3005'));
app.get('/api/supervisores/:id', createProxy('http://localhost:3005'));
app.get('/api/supervisores/gmail/:gmail', createProxy('http://localhost:3005'));
app.put('/api/supervisores/:id/perfil', createProxy('http://localhost:3005'));
app.put('/api/supervisores/:id/contrasena', createProxy('http://localhost:3005'));
app.put('/api/supervisores/:id/estado', createProxy('http://localhost:3005'));
app.get('/api/supervisores/dashboard/stats', createProxy('http://localhost:3005'));

// Servicio de Ofertas (puerto 3006)
app.use('/api/ofertas', createProxy('http://localhost:3006'));

// Servicio de Ofertantes (puerto 3007)
app.use('/api/ofertantes', createProxy('http://localhost:3007'));

// Servicio de Cursos (puerto 3008)
app.use('/api/cursos', createProxy('http://localhost:3008'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway de Nexa Careers',
    status: 'running',
    endpoints: {
      estudiantes: 'http://localhost:3000/api/estudiantes',
      carreras: 'http://localhost:3000/api/carreras',
      empleadores: 'http://localhost:3000/api/empleadores',
      supervisores: 'http://localhost:3000/api/supervisores',
      ofertas: 'http://localhost:3000/api/ofertas',
      ofertantes: 'http://localhost:3000/api/ofertantes'
      cursos: 'http://localhost:3000/api/cursos'
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌐 API Gateway corriendo en http://localhost:${PORT}`);
  console.log('✅ Gateway listo para recibir peticiones');
});
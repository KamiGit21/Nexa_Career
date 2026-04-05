import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

console.log('Iniciando API Gateway...');

// Configuración para manejar archivos grandes y multipart
app.use(cors());
// No usar express.json() para todas las rutas, o configurarlo con límite
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log todas las peticiones
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Proxy simple para JSON
const proxyTo = (targetUrl) => async (req, res) => {
  try {
    const fullUrl = `${targetUrl}${req.url}`;
    console.log(`🔄 Proxy: ${req.method} ${fullUrl}`);
    
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
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Proxy para archivos PDF (versión corregida)
const proxyFileTo = (targetUrl) => async (req, res) => {
  try {
    const fullUrl = `${targetUrl}${req.url}`;
    console.log(`🔄 [FILE] Proxy: ${req.method} ${fullUrl}`);
    
    // Para POST de subida de archivos
    if (req.method === 'POST') {
      // Obtener el Content-Type original (incluye el boundary)
      const contentType = req.headers['content-type'];
      console.log('Content-Type original:', contentType);
      
      // Recolectar los chunks del body original (el archivo)
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const bodyBuffer = Buffer.concat(chunks);
      console.log('Tamaño del body recibido:', bodyBuffer.length, 'bytes');
      
      // Reenviar exactamente el mismo body con el mismo Content-Type
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': contentType
        },
        body: bodyBuffer
      });
      
      // Leer la respuesta como JSON
      const data = await response.json();
      console.log('Respuesta del servicio:', data);
      res.status(response.status).json(data);
    } 
    // Para GET de ver CV
    else if (req.method === 'GET' && req.url.includes('/cv/ver')) {
      const response = await fetch(fullUrl);
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="cv.pdf"');
      res.send(Buffer.from(buffer));
    }
    else {
      // Para otros métodos (DELETE, GET info, etc.)
      const response = await fetch(fullUrl, {
        method: req.method
      });
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('❌ Error FILE proxy:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// ============= RUTAS =============

// Servicio de Carreras (puerto 3002)
app.use('/api/carreras', proxyTo('http://localhost:3002'));

// Servicio de Estudiantes (puerto 3003)
app.get('/api/estudiantes', proxyTo('http://localhost:3003'));
app.get('/api/estudiantes/:id', proxyTo('http://localhost:3003'));
app.get('/api/estudiantes/gmail/:gmail', proxyTo('http://localhost:3003'));
app.post('/api/estudiantes/registrar', proxyTo('http://localhost:3003'));
app.put('/api/estudiantes/:id/perfil', proxyTo('http://localhost:3003'));
app.put('/api/estudiantes/:id/contrasena', proxyTo('http://localhost:3003'));
app.put('/api/estudiantes/:id/estado', proxyTo('http://localhost:3003'));
app.get('/api/estudiantes/:id/postulaciones', proxyTo('http://localhost:3003'));

// Rutas de CV (manejo especial)
app.post('/api/estudiantes/:id/cv/upload', proxyFileTo('http://localhost:3003'));
app.get('/api/estudiantes/:id/cv/ver', proxyFileTo('http://localhost:3003'));
app.get('/api/estudiantes/:id/cv/info', proxyTo('http://localhost:3003'));
app.delete('/api/estudiantes/:id/cv', proxyTo('http://localhost:3003'));

// Servicio de Empleadores (puerto 3004)
app.use('/api/empleadores', proxyTo('http://localhost:3004'));

// Servicio de Supervisores (puerto 3005)
app.use('/api/supervisores', proxyTo('http://localhost:3005'));

// Servicio de Ofertas (puerto 3006)
app.use('/api/ofertas', proxyTo('http://localhost:3006'));

// Servicio de Ofertantes (puerto 3007)
app.use('/api/ofertantes', proxyTo('http://localhost:3007'));

// Servicio de Cursos (puerto 3008)
app.use('/api/cursos', proxyTo('http://localhost:3008'));

// Servicio de Categorias (puerto 3009)
app.use('/api/categorias', proxyTo('http://localhost:3009'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway Nexa Careers',
    status: 'running',
    version: '1.0.0'
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ API Gateway corriendo en http://localhost:${PORT}`);
});
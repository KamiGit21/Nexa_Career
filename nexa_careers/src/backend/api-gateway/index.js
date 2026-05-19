import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const URL_CARRERA    = process.env.URL_CARRERA    || 'http://localhost:3002';
const URL_ESTUDIANTE = process.env.URL_ESTUDIANTE || 'http://localhost:3003';
const URL_EMPLEADOR  = process.env.URL_EMPLEADOR  || 'http://localhost:3004';
const URL_SUPERVISOR = process.env.URL_SUPERVISOR || 'http://localhost:3005';
const URL_OFERTA     = process.env.URL_OFERTA     || 'http://localhost:3006';
const URL_OFERTANTE  = process.env.URL_OFERTANTE  || 'http://localhost:3007';
const URL_CURSO      = process.env.URL_CURSO      || 'http://localhost:3008';
const URL_CATEGORIA  = process.env.URL_CATEGORIA  || 'http://localhost:3009';

const app = express();

console.log('Iniciando API Gateway...');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

const proxyTo = (targetUrl) => async (req, res) => {
  try {
    const fullUrl = `${targetUrl}${req.originalUrl}`;
    console.log(`🔄 Redirigiendo ${req.method} ${req.originalUrl} a: ${fullUrl}`);

    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    delete options.headers.host;

    if (req.method !== 'GET' && req.method !== 'DELETE') {
      options.body = req.body ? JSON.stringify(req.body) : null;
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

const proxyFileTo = (targetUrl) => async (req, res) => {
  try {
    const fullUrl = `${targetUrl}${req.url}`;
    console.log(`🔄 [FILE] Proxy: ${req.method} ${fullUrl}`);

    if (req.method === 'POST') {
      const contentType = req.headers['content-type'];
      console.log('Content-Type original:', contentType);

      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const bodyBuffer = Buffer.concat(chunks);
      console.log('Tamaño del body recibido:', bodyBuffer.length, 'bytes');

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: bodyBuffer
      });

      const data = await response.json();
      console.log('Respuesta del servicio:', data);
      res.status(response.status).json(data);
    }
    else if (req.method === 'GET' && req.url.includes('/cv/ver')) {
      const response = await fetch(fullUrl);
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="cv.pdf"');
      res.send(Buffer.from(buffer));
    }
    else {
      const response = await fetch(fullUrl, { method: req.method });
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('❌ Error FILE proxy:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// ============= RUTAS =============

app.use('/api/carreras', proxyTo(URL_CARRERA));

app.get('/api/estudiantes', proxyTo(URL_ESTUDIANTE));
app.get('/api/estudiantes/analisis-ia/:id', proxyTo(URL_ESTUDIANTE));
app.get('/api/estudiantes/:id', proxyTo(URL_ESTUDIANTE));
app.get('/api/estudiantes/gmail/:gmail', proxyTo(URL_ESTUDIANTE));
app.post('/api/estudiantes/registrar', proxyTo(URL_ESTUDIANTE));
app.put('/api/estudiantes/:id/perfil', proxyTo(URL_ESTUDIANTE));
app.put('/api/estudiantes/:id/contrasena', proxyTo(URL_ESTUDIANTE));
app.put('/api/estudiantes/:id/estado', proxyTo(URL_ESTUDIANTE));
app.post('/api/estudiantes/enviarCodigo', proxyTo(URL_ESTUDIANTE));

app.post('/api/estudiantes/:id/cv/upload', proxyFileTo(URL_ESTUDIANTE));
app.get('/api/estudiantes/:id/cv/ver', proxyFileTo(URL_ESTUDIANTE));
app.get('/api/estudiantes/:id/cv/info', proxyTo(URL_ESTUDIANTE));
app.delete('/api/estudiantes/:id/cv', proxyTo(URL_ESTUDIANTE));

app.use('/api/empleadores', proxyTo(URL_EMPLEADOR));

app.post('/api/supervisores/registrar', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/admin/estudiantes', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/admin/empleadores', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/admin/supervisores', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/admin/logs/estudiante/:id', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/admin/logs/empleador/:id', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/gmail/:gmail', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/:id', proxyTo(URL_SUPERVISOR));
app.put('/api/supervisores/:id/perfil', proxyTo(URL_SUPERVISOR));
app.put('/api/supervisores/:id/contrasena', proxyTo(URL_SUPERVISOR));
app.put('/api/supervisores/:id/estado', proxyTo(URL_SUPERVISOR));
app.put('/api/supervisores/:id_supervisor/bloquear', proxyTo(URL_SUPERVISOR));
app.get('/api/supervisores/dashboard/stats', proxyTo(URL_SUPERVISOR));
app.post('/api/supervisores/enviarCodigo', proxyTo(URL_SUPERVISOR));

app.use('/api/ofertas', proxyTo(URL_OFERTA));

app.use('/api/ofertantes', proxyTo(URL_OFERTANTE));
app.get('/api/ofertantes/oferta/:id_oferta/con-cv', proxyTo(URL_OFERTANTE));

app.use('/api/cursos', proxyTo(URL_CURSO));

app.use('/api/categorias', proxyTo(URL_CATEGORIA));

app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway Nexa Careers',
    status: 'running',
    endpoints: {
      estudiantes:  'http://localhost:3000/api/estudiantes',
      carreras:     'http://localhost:3000/api/carreras',
      empleadores:  'http://localhost:3000/api/empleadores',
      supervisores: 'http://localhost:3000/api/supervisores',
      ofertas:      'http://localhost:3000/api/ofertas',
      ofertantes:   'http://localhost:3000/api/ofertantes',
      cursos:       'http://localhost:3000/api/cursos',
      categorias:   'http://localhost:3000/api/categorias'
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ API Gateway corriendo en http://localhost:${PORT}`);
});
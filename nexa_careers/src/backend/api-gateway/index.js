import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

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
      headers: { 'Content-Type': 'application/json' },
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
      const chunks = [];
      for await (const chunk of req) { chunks.push(chunk); }
      const bodyBuffer = Buffer.concat(chunks);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: bodyBuffer
      });
      
      const data = await response.json();
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

// ============= RUTAS (AHORA APUNTAN A LOS CONTENEDORES) =============

app.use('/api/carreras', proxyTo('http://servicio-carrera:3002'));

app.get('/api/estudiantes', proxyTo('http://servicio-estudiante:3003'));
app.get('/api/estudiantes/:id', proxyTo('http://servicio-estudiante:3003'));
app.get('/api/estudiantes/gmail/:gmail', proxyTo('http://servicio-estudiante:3003'));
app.post('/api/estudiantes/registrar', proxyTo('http://servicio-estudiante:3003'));
app.put('/api/estudiantes/:id/perfil', proxyTo('http://servicio-estudiante:3003'));
app.put('/api/estudiantes/:id/contrasena', proxyTo('http://servicio-estudiante:3003'));
app.put('/api/estudiantes/:id/estado', proxyTo('http://servicio-estudiante:3003'));
app.get('/api/estudiantes/:id/postulaciones', proxyTo('http://servicio-estudiante:3003'));
app.post('/api/estudiantes/enviarCodigo', proxyTo('http://servicio-estudiante:3003'));
app.post('/api/estudiantes/:id/cv/upload', proxyFileTo('http://servicio-estudiante:3003'));
app.get('/api/estudiantes/:id/cv/ver', proxyFileTo('http://servicio-estudiante:3003'));
app.get('/api/estudiantes/:id/cv/info', proxyTo('http://servicio-estudiante:3003'));
app.delete('/api/estudiantes/:id/cv', proxyTo('http://servicio-estudiante:3003'));
app.use('/api/estudiantes', proxyTo('http://servicio-estudiante:3003'));
app.get('/api/estudiantes/analisis-ia/:id', proxyTo('http://servicio-estudiante:3003'));

app.use('/api/estudiantes', proxyTo('http://servicio-estudiante:3003'));
app.use('/api/empleadores', proxyTo('http://servicio-empleador:3004'));

app.post('/api/supervisores/registrar', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/admin/estudiantes', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/admin/empleadores', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/admin/supervisores', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/admin/logs/estudiante/:id', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/admin/logs/empleador/:id', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/gmail/:gmail', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/:id', proxyTo('http://servicio-supervisor:3005'));
app.put('/api/supervisores/:id/perfil', proxyTo('http://servicio-supervisor:3005'));
app.put('/api/supervisores/:id/contrasena', proxyTo('http://servicio-supervisor:3005'));
app.put('/api/supervisores/:id/estado', proxyTo('http://servicio-supervisor:3005'));
app.put('/api/supervisores/:id_supervisor/bloquear', proxyTo('http://servicio-supervisor:3005'));
app.get('/api/supervisores/dashboard/stats', proxyTo('http://servicio-supervisor:3005'));
app.post('/api/supervisores/enviarCodigo', proxyTo('http://servicio-supervisor:3005'));
app.use('/api/supervisores', proxyTo('http://servicio-supervisor:3005'));

app.use('/api/ofertas', proxyTo('http://servicio-oferta:3006'));

app.use('/api/ofertantes', proxyTo('http://servicio-ofertante:3007'));
app.get('/api/ofertantes/oferta/:id_oferta/con-cv', proxyTo('http://servicio-ofertante:3007'));

app.use('/api/cursos', proxyTo('http://servicio-curso:3008'));
app.use('/api/categorias', proxyTo('http://servicio-categoria:3009'));

app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway Nexa Careers (DOCKERIZADO)',
    status: 'running'
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ API Gateway corriendo en el puerto ${PORT}`);
});
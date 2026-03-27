import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

console.log('Iniciando enrutamiento del API Gateway...');

// Middlewares
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------

// Carreras
app.use('/api/carreras', createProxyMiddleware({ 
  target: 'http://localhost:3002',
  changeOrigin: true 
}));

// Estudiantes
app.use('/api/estudiantes', createProxyMiddleware({ 
  target: 'http://localhost:3003',
  changeOrigin: true 
}));

// Empleadores - CORREGIDO
app.use('/api/empleadores', createProxyMiddleware({ 
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/api/empleadores': '/api/empleadores'  // Mantener la ruta completa
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxy: ${req.method} ${req.url} -> http://localhost:3004${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en proxy:', err);
    res.status(500).json({ success: false, message: 'Error de conexión con el microservicio' });
  }
}));

// Supervisores
app.use('/api/supervisores', createProxyMiddleware({ 
  target: 'http://localhost:3005',
  changeOrigin: true 
}));

// Ofertas
app.use('/api/ofertas', createProxyMiddleware({ 
  target: 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/ofertas': ''
  }
}));

// Ofertantes
app.use('/api/ofertantes', createProxyMiddleware({ 
  target: 'http://localhost:3007',
  changeOrigin: true 
}));

// Ruta de prueba para verificar que el gateway funciona
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API Gateway funcionando' });
});

// ---------------- SERVER ----------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 API Gateway central corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   - http://localhost:${PORT}/api/empleadores`);
  console.log(`   - http://localhost:${PORT}/api/estudiantes`);
  console.log(`   - http://localhost:${PORT}/api/ofertas`);
  console.log(`   - http://localhost:${PORT}/api/health`);
});
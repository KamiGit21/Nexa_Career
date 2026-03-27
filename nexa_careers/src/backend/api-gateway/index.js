import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express(); // ✅ PRIMERO crear app

console.log('Iniciando enrutamiento del API Gateway...');

// ✅ LUEGO configurar middlewares
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

// Empleadores
app.use('/api/empleadores', createProxyMiddleware({ 
  target: 'http://localhost:3004',
  changeOrigin: true 
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

// ---------------- SERVER ----------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 API Gateway central corriendo en http://localhost:${PORT}`);
});
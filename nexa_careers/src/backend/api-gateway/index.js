import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
console.log('Iniciando enrutamiento del API Gateway...');

//Redirigir tráfico de Carreras al puerto 3002
app.use('/api/carreras', createProxyMiddleware({ 
  target: 'http://localhost:3002/api/carreras', 
  changeOrigin: true 
}));

//Redirigir tráfico de Estudiantes al puerto 3003
app.use('/api/estudiantes', createProxyMiddleware({ 
  target: 'http://localhost:3003/api/estudiantes', 
  changeOrigin: true 
}));

app.use('/api/empleadores', createProxyMiddleware({ 
  target: 'http://localhost:3004/api/empleadores', 
  changeOrigin: true 
}));

app.use('/api/supervisores', createProxyMiddleware({ 
  target: 'http://localhost:3005/api/supervisores', 
  changeOrigin: true 
}));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 API Gateway central corriendo en http://localhost:${PORT}`);
  console.log(`➡️  Todas las peticiones frontend deben ir a este puerto.`);
});
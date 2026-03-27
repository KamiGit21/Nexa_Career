import express from 'express';
import * as ofertaController from './ofertaController.js';

const router = express.Router();

// ✅ PRIMERO rutas específicas
router.post('/crear', ofertaController.crearOferta);
router.get('/', ofertaController.listarOfertas);
router.get('/titulo/:oferta', ofertaController.buscarOfertaPorTitulo);
router.get('/empleador/:id_empleador', ofertaController.buscarOfertasPorEmpleador);

// ✅ DESPUÉS rutas con parámetros
router.get('/:id', ofertaController.obtenerOfertaPorId);

router.put('/:id/editar', ofertaController.editarOferta);
router.put('/:id/estado', ofertaController.cambiarEstadoOferta);

export default router;
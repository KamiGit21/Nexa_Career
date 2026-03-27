// src/backend/servicioOferta/APIOferta/ofertaRoutes.js
import express from 'express';
import * as ofertaController from './ofertaController.js';

const router = express.Router();

router.post('/crear', ofertaController.crearOferta);
router.get('/', ofertaController.listarOfertas);
router.get('/:id', ofertaController.buscarOfertaPorId);
router.get('/titulo/:oferta', ofertaController.buscarOfertaPorTitulo);
router.get('/empleador/:id_empleador', ofertaController.buscarOfertasPorEmpleador);

router.put('/:id/editar', ofertaController.editarOferta);
router.put('/:id/estado', ofertaController.cambiarEstadoOferta);

export default router;
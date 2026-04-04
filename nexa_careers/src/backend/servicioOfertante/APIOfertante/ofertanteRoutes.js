// src/backend/servicioOfertante/APIOfertante/ofertanteRoutes.js
import express from 'express';
import * as ofertanteController from './ofertanteController.js';

const router = express.Router();

router.post('/postular', ofertanteController.crearOfertante);
router.get('/estudiante/:id_estudiante/postulaciones', ofertanteController.obtenerPostulacionesEstudiante);
router.get('/:id', ofertanteController.buscarOfertantePorId);
router.get('/oferta/:id_oferta', ofertanteController.buscarPorOferta);
router.get('/estudiante/:id_estudiante', ofertanteController.buscarPorEstudiante);

router.put('/:id/estado', ofertanteController.cambiarEstadoOfertante);

export default router;
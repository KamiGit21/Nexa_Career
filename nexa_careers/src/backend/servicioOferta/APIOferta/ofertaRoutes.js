import express from 'express';
import * as ofertaController from './ofertaController.js';

const router = express.Router();



// Ruta para obtener una oferta específica por ID
router.get('/:id', ofertaController.obtenerOfertaPorId);

export default router;
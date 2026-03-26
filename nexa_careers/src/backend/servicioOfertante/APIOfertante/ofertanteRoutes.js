import express from 'express';
import * as ofertanteController from './ofertanteController.js';

const router = express.Router();

// Obtener postulantes de una oferta específica
router.get('/oferta/:id_oferta/postulantes', ofertanteController.obtenerPostulantesPorOferta);

export default router;
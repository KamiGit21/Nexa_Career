import express from 'express';
import * as carreraController from './carreraController.js';

const router = express.Router();

router.post('/registrar', carreraController.registrarCarrera);
router.get('/', carreraController.listarCarreras);
router.get('/buscar', carreraController.buscarCarreraPorNombre);
router.get('/:id', carreraController.buscarCarreraPorId);

export default router;
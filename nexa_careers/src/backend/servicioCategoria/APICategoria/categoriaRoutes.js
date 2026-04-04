import express from 'express';
import * as categoriaController from './categoriaController.js';

const router = express.Router();

router.post('/registrar', categoriaController.registrarCategoria);
router.get('/', categoriaController.listarCategorias);
router.get('/buscar', categoriaController.buscarCategoriaPorNombre);
router.get('/:id', categoriaController.buscarCategoriaPorId);

export default router;
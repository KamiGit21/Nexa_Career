import express from 'express';
import * as categoriaController from './categoriaController.js';

const router = express.Router();

router.post('/registrar', categoriaController.registrarCategoria);
router.get('/', categoriaController.listarCategorias);
router.get('/buscar', categoriaController.buscarCategoriaPorNombre);
router.get('/:id', categoriaController.buscarCategoriaPorId);
// Eliminar categorías requiere eliminar primero las referencias en categoria_oferta y categoria_curso
// router.delete('/:id', categoriaController.eliminarCategoria);

export default router;
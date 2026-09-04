import express from 'express';
import * as categoriaController from './categoriaController.js';

const router = express.Router();

// Rutas más específicas primero
router.post('/registrar', categoriaController.registrarCategoria);
router.get('/buscar', categoriaController.buscarCategoriaPorNombre);
router.get('/:id', categoriaController.buscarCategoriaPorId);

router.get('/', categoriaController.listarCategorias);
router.put('/oferta/:id_oferta', categoriaController.actualizarCategoriasDeOferta);
router.put('/:id/asociar-oferta', categoriaController.asociarCategoriaAOferta);
router.put('/:id', categoriaController.editarCategoria);
router.patch('/:id/estado', categoriaController.cambiarEstadoCategoria);

export default router;
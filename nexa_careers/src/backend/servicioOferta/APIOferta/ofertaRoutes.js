// src/backend/servicioOferta/APIOferta/ofertaRoutes.js
import express from 'express';
import * as ofertaController from './ofertaController.js';

const router = express.Router();

<<<<<<< HEAD


// Ruta para obtener una oferta específica por ID
router.get('/:id', ofertaController.obtenerOfertaPorId);
=======
router.post('/crear', ofertaController.crearOferta);
router.get('/', ofertaController.listarOfertas);
router.get('/:id', ofertaController.buscarOfertaPorId);
router.get('/titulo/:oferta', ofertaController.buscarOfertaPorTitulo);
router.get('/empleador/:id_empleador', ofertaController.buscarOfertasPorEmpleador);

router.put('/:id/editar', ofertaController.editarOferta);
router.put('/:id/estado', ofertaController.cambiarEstadoOferta);
>>>>>>> f73765ffa0ff0502a2929c2b44abc8fe5658fde9

export default router;
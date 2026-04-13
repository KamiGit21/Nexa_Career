import express from 'express';
import * as ofertaController from './ofertaController.js';

const router = express.Router();

//  PRIMERO rutas específicas
router.post('/crear', ofertaController.crearOferta);
router.get('/', ofertaController.listarOfertas);
router.get('/pendientes', ofertaController.listarOfertasPendientes);
router.get('/titulo/:oferta', ofertaController.buscarOfertaPorTitulo);
router.get('/empleador/:id_empleador', ofertaController.buscarOfertasPorEmpleador);

router.get('/:id/postulantes', ofertaController.obtenerPostulantesPorOferta);


//  DESPUÉS rutas con parámetros
router.get('/:id', ofertaController.obtenerOfertaPorId);
router.put('/:id/editar', ofertaController.editarOferta);
router.patch('/:id/estado', ofertaController.cambiarEstadoOferta);
router.put('/:id/archivar', ofertaController.cambiarEstadoOfertaAPendiente); // estado = 3 (inactivo), para dar de baja una oferta

router.get('/pagina/:pagina/size/:size', ofertaController.obtenerOfertasPaginacion);
router.get('/pagina/:pagina/size/:size/estado/:estado', ofertaController.obtenerOfertasPaginacionPorEstado);
router.get('/pagina/:pagina/size/:size/apertura/arriba', ofertaController.obtenerOfertasPaginacionPorFechaAscendente);
router.get('/pagina/:pagina/size/:size/apertura/abajo', ofertaController.obtenerOfertasPaginacionPorFechaDescendente);
router.get('/pagina/:pagina/size/:size/apertura/arriba/estado/:estado/', ofertaController.obtenerOfertasPaginacionPorEstadoYFechaAscendente);
router.get('/pagina/:pagina/size/:size/apertura/abajo/estado/:estado/', ofertaController.obtenerOfertasPaginacionPorEstadoYFechaDescendente);


export default router;
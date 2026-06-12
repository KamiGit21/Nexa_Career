import express from 'express';
import * as empleadorController from './empleadorController.js';

const router = express.Router();

router.post('/registrar', empleadorController.registrarEmpleador);
router.get('/', empleadorController.listarEmpleadores);
router.get('/:id', empleadorController.buscarEmpleadorPorId);
router.get('/gmail/:gmail', empleadorController.buscarEmpleadorPorGmail);

router.put('/:id/perfil', empleadorController.actualizarPerfil);
router.put('/:id/contrasena', empleadorController.cambiarContrasena);
router.put('/:id/estado', empleadorController.cambiarEstado);

router.post('/enviarCodigo', empleadorController.enviarCodigoEmpleador);
router.get('/contar/:activo', empleadorController.contarEmpleadores);
router.get('/notificacion/postulacion/:idPostulacion', empleadorController.enviarNotificacionPostulacionEmpleador);

export default router;
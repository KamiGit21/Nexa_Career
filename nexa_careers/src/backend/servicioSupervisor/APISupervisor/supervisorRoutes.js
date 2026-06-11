import express from 'express';
import * as supervisorController from './supervisorController.js';

const router = express.Router();

router.post('/registrar', supervisorController.registrarSupervisor);
router.get('/', supervisorController.listarSupervisores);

//Rutas admin para evitar que sea considerado como parámetro
router.get('/admin/estudiantes', supervisorController.listarEstudiantesAdmin);
router.get('/admin/empleadores', supervisorController.listarEmpleadoresAdmin);
router.get('/admin/supervisores', supervisorController.listarSupervisoresAdmin);
router.get('/admin/logs/estudiante/:id', supervisorController.obtenerLogsEstudiante);
router.get('/admin/logs/empleador/:id', supervisorController.obtenerLogsEmpleador);

//Rutas con parámetros - MÁS ESPECÍFICAS PRIMERO
router.get('/gmail/:gmail', supervisorController.buscarSupervisorPorGmail);
router.put('/:id_supervisor/bloquear', supervisorController.bloquearUsuario);
router.put('/:id_supervisor/desbloquear', supervisorController.desbloquearUsuario);
router.put('/:id/perfil', supervisorController.actualizarPerfil);
router.put('/:id/contrasena', supervisorController.cambiarContrasena);
router.put('/:id/estado', supervisorController.cambiarEstado);
router.get('/:id', supervisorController.buscarSupervisorPorId);

router.post('/enviarCodigo', supervisorController.enviarCodigoSupervisor);
router.get('/notificacion/oferta/:idOferta', supervisorController.notificarNuevaOfertaA_Supervisores);

export default router;
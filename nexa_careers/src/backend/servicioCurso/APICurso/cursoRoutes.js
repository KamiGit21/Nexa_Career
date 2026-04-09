import express from 'express';
import * as cursoController from './cursoController.js';

const router = express.Router();

// Rutas específicas PRIMERO (antes de las rutas con parámetros)
router.post('/registrarPorEstudiante', cursoController.registrarCursoEstudiante);
router.post('/registrarPorEmpleador', cursoController.registrarCursoEmpleador);
router.get('/listarDisponibles', cursoController.listarCursosDisponibles);
router.get('/estudiante/:id_estudiante', cursoController.listarCursosPorEstudiante);
router.get('/empleador/:id_empleador', cursoController.listarCursosPorEmpleador);
router.get('/pendientes', cursoController.listarCursosPendientes); // ← NUEVO

// Rutas generales
router.get('/', cursoController.listarCursos);

// Rutas con parámetros AL FINAL
router.patch('/:id_curso/estado', cursoController.cambiarEstadoCurso);
router.get('/:id_curso', cursoController.obtenerCursoPorId);

router.get('/pagina/:pagina', cursoController.obtenerCursosPaginacion);
router.get('/pagina/:pagina/estado/:estado', cursoController.obtenerCursosPaginacionPorEstado);
router.get('/pagina/:pagina/fecha', cursoController.obtenerCursosPaginacionPorFecha);
router.get('/pagina/:pagina/fecha/estado/:estado', cursoController.obtenerCursosPaginacionPorEstadoYFecha);

export default router;
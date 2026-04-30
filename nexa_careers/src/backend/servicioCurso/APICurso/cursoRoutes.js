import express from 'express';
import * as cursoController from './cursoController.js';

const router = express.Router();

// Rutas específicas PRIMERO (antes de las rutas con parámetros)
router.post('/registrarPorEstudiante', cursoController.registrarCursoEstudiante);
router.post('/registrarPorEmpleador', cursoController.registrarCursoEmpleador);
router.get('/listarDisponibles', cursoController.listarCursosDisponibles);
router.get('/estudiante/:id_estudiante', cursoController.listarCursosPorEstudiante);
router.get('/empleador/:id_empleador', cursoController.listarCursosPorEmpleador);
router.get('/pendientes', cursoController.listarCursosPendientes);
router.get('/busqueda/avanzada', cursoController.buscarCursosPublicosAvanzado);

// Rutas para categorías de cursos
router.post('/:id_curso/categorias', cursoController.agregarCategoriaACurso);
router.delete('/:id_curso/categorias/:id_categoria', cursoController.quitarCategoriaDeCurso);
router.get('/:id_curso/categorias', cursoController.listarCategoriasDeCurso);

// Rutas generales
router.get('/', cursoController.listarCursos);


// Rutas con parámetros AL FINAL
router.patch('/:id_curso/estado', cursoController.cambiarEstadoCurso);
router.put('/:id_curso', cursoController.actualizarCurso);
router.get('/:id_curso', cursoController.obtenerCursoPorId);

//Paginacion
router.get('/pagina/:pagina/size/:size', cursoController.obtenerCursosPaginacion);
router.get('/pagina/:pagina/size/:size/estado/:estado', cursoController.obtenerCursosPaginacionPorEstado);
router.get('/pagina/:pagina/size/:size/fecha/abajo', cursoController.obtenerCursosPaginacionPorFechaDesendente);
router.get('/pagina/:pagina/size/:size/fecha/arriba', cursoController.obtenerCursosPaginacionPorFechaAscendente);
router.get('/pagina/:pagina/size/:size/fecha/abajo/estado/:estado', cursoController.obtenerCursosPaginacionPorEstadoYFechaDescendente);
router.get('/pagina/:pagina/size/:size/fecha/arriba/estado/:estado', cursoController.obtenerCursosPaginacionPorEstadoYFechaAscendente);

// Rutas con parámetros AL FINAL
router.patch('/:id_curso/archivar', cursoController.archivarCurso);
router.patch('/:id_curso/desarchivar', cursoController.desarchivarCurso); 
router.patch('/:id_curso/estado', cursoController.cambiarEstadoCurso);
router.get('/:id_curso', cursoController.obtenerCursoPorId);

export default router;


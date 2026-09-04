import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000', // API Gateway
    headers: { 'Content-Type': 'application/json' },
})

// POST /api/categorias/registrar - Registrar nueva categoría
export async function registrarCategoria(datos) {
    const { data } = await api.post('/api/categorias/registrar', datos)
    return data
}

// GET /api/categorias - Listar todas las categorías (solo activas por defecto)
export async function listarCategorias() {
    const { data } = await api.get('/api/categorias')
    return data
}

// GET /api/categorias?incluir=todas - Listar todas las categorías incluyendo archivadas
export async function listarCategoriasCompleto() {
    const { data } = await api.get('/api/categorias?incluir=todas')
    return data
}

// GET /api/categorias/:id - Obtener categoría por ID
export async function obtenerCategoriaPorId(id) {
    const { data } = await api.get(`/api/categorias/${id}`)
    return data
}

// GET /api/categorias/buscar?nombre= - Buscar categorías por nombre
export async function buscarCategoriasPorNombre(nombre) {
    const { data } = await api.get(`/api/categorias/buscar?nombre=${encodeURIComponent(nombre)}`)
    return data
}

// PUT /api/categorias/:id - Editar nombre de una categoría
export async function actualizarCategoria(id, categoria) {
    const { data } = await api.put(`/api/categorias/${id}`, { categoria })
    return data
}

// PUT /api/categorias/:id/asociar-oferta - Asociar categoría a una oferta
export async function asociarCategoriaAOferta(idCategoria, idOferta) {
    const { data } = await api.put(`/api/categorias/${idCategoria}/asociar-oferta`, { id_oferta: idOferta })
    return data
}

// PATCH /api/categorias/:id/estado - Cambiar estado de la categoría (archivar/desarchivar)
export async function cambiarEstadoCategoria(idCategoria, estado) {
    const { data } = await api.patch(`/api/categorias/${idCategoria}/estado`, { estado })
    return data
}

// PUT /api/categorias/oferta/:idOferta - Actualizar categorías de una oferta
export async function actualizarCategoriasOferta(idOferta, categorias) {
    const { data } = await api.put(`/api/categorias/oferta/${idOferta}`, { categorias })
    return data
}

export default {
    registrarCategoria,
    listarCategorias,
    listarCategoriasCompleto,
    obtenerCategoriaPorId,
    buscarCategoriasPorNombre,
    actualizarCategoria,
    asociarCategoriaAOferta,
    cambiarEstadoCategoria,
    actualizarCategoriasOferta,
}
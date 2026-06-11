// src/frontend/services/categoriaService.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000', // API Gateway
    headers: { 'Content-Type': 'application/json' },
})

// GET /api/categorias - Listar todas las categorías
export async function listarCategorias() {
    const { data } = await api.get('/api/categorias')
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

// PUT /api/categorias/:id/asociar-oferta - Asociar categoría a una oferta
export async function asociarCategoriaAOferta(idCategoria, idOferta) {
    const { data } = await api.put(`/api/categorias/${idCategoria}/asociar-oferta`, { id_oferta: idOferta })
    return data
}

export async function actualizarCategoriasOferta(idOferta, categorias) {
    const { data } = await api.put(`/api/categorias/oferta/${idOferta}`, { categorias })
    return data
}

export default {
    listarCategorias,
    obtenerCategoriaPorId,
    buscarCategoriasPorNombre,
    asociarCategoriaAOferta,
    actualizarCategoriasOferta
}

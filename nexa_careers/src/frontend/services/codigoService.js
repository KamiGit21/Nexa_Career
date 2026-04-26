export const crearCodigo = async () => {
    const codigo = Math.random().toString(10).substring(2, 8);
    return codigo;
}

export const compararCodigos = async (codigoEnviado, codigoCliente) => {
    return codigoEnviado === codigoCliente;
}
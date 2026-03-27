<template>
  <div class="nueva-oferta">
    <h2>Crear Nueva Oferta</h2>

    <form @submit.prevent="crearNuevaOferta">
      <div>
        <label>Título:</label>
        <input v-model="titulo" type="text" required />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea v-model="descripcion" required></textarea>
      </div>

      <div>
        <label>Fecha de Apertura:</label>
        <input v-model="fecha_apertura" type="date" required />
      </div>

      <div>
        <label>ID Empleador:</label>
        <input v-model="id_empleador" type="number" required />
      </div>

      <button type="submit">Crear Oferta</button>
    </form>

    <h2>Ofertas Existentes</h2>
    <ul>
      <li v-for="oferta in ofertas" :key="oferta.id_oferta">
        {{ oferta.oferta }} - {{ oferta.descripcion }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ofertaService from '@/services/ofertaService.js'

// ✅ VARIABLES CORRECTAS (las que usa el template)
const titulo = ref('')
const descripcion = ref('')
const fecha_apertura = ref('')
const id_empleador = ref('')

// lista
const ofertas = ref([])

// ✅ cargar ofertas
const cargarOfertas = async () => {
  try {
    const res = await ofertaService.listarOfertas()
    ofertas.value = res.data || []
  } catch (error) {
    console.error('Error al listar ofertas:', error)
  }
}

// ✅ crear oferta
const crearNuevaOferta = async () => {
  try {
    const payload = {
      oferta: titulo.value,
      descripcion: descripcion.value,
      fecha_apertura: fecha_apertura.value,
      id_emepleador: id_empleador.value // 👈 TU BACKEND USA ESTE NOMBRE
    }

    console.log('Payload enviado:', payload)

    const res = await ofertaService.crearOferta(payload)

    console.log('Respuesta backend:', res)

    if (res.success) {
      alert('✅ Oferta creada correctamente')

      // limpiar
      titulo.value = ''
      descripcion.value = ''
      fecha_apertura.value = ''
      id_empleador.value = ''

      cargarOfertas()
    } else {
      alert('❌ ' + res.message)
    }

  } catch (error) {
    console.error('Error al crear oferta:', error)
    alert('❌ Error al crear oferta')
  }
}

// init
onMounted(() => {
  cargarOfertas()
})
</script>

<style scoped>
.nueva-oferta {
  max-width: 600px;
  margin: auto;
}

form div {
  margin-bottom: 10px;
}

button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
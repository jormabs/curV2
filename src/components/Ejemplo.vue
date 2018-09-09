<template>
  <div class="principal">
    <div class="contenido">
      <div class="bloque">
        <div class="bloque__caracteristica">
          <span>{{mostrarDatos}}</span>
        </div>
        <div class="bloque__contenido">
          <span>{{ titulo }}</span>
        </div>
        <div class="bloque__contenido">
          <span>Email: </span>
          <span>{{ email }}</span>
        </div>
        <div class="bloque__contenido">
          <span>Mensaje: </span>
          <span>{{ mensajeEnviado }}</span>
        </div>
      </div>
      <div class="bloque">
        <div class="bloque__caracteristica">
          <span>Computed - Campos Calculados</span>
        </div>
        <div class="bloque__contenido">
          <span>{{ nombreCompleto }}</span>
        </div>
        <div class="bloque__contenido">
          <span>Edad: </span>
          <span>{{ edad }}</span>
        </div>
      </div>
      <div class="bloque">
        <div class="bloque__caracteristica">
          <span>v-bind - Enlazar Atributos</span>
        </div>
        <div class="bloque__contenido">
          <a :href="urlBiografia" target="_blank">Biografia</a>
        </div>
      </div>
      <div class="bloque">
        <div class="bloque__caracteristica">
          <span>v-model y v-bind</span>
        </div>
        <div class="bloque__contenido">
          <div class="mb-20" :class="pasaporte ? 'exito' : 'error'">
            <span>Pasaporte: </span>
            <input type="checkbox" v-model="pasaporte">
            <span>{{ tienePasaporte }}</span>
          </div>
          <div>
            <span>Email: </span>
            <input type="text" v-model="email">
          </div>
        </div>
      </div>
      <div class="bloque">
        <div class="bloque__caracteristica">
          <span>v-once</span>
        </div>
        <div class="bloque__contenido">
          <span v-once>Email Original: {{email}}</span>
        </div>
      </div>
      <div ref="coordenadas" class="bloque" @mousemove="actualizarCoordenadas">
        <div class="bloque__caracteristica">
          <span>Methods, Eventos v-on y ref</span>
        </div>
        <div class="bloque__contenido">
          <div class="mb-20">
            <span>Hijos: </span>
            <button class="btn-accion" @click="actualizarNumeroHijos(1)">+</button>
            <button class="btn-accion" @click="actualizarNumeroHijos(-1)">-</button>
            <span> {{numeroHijos}}</span>
          </div>          
          <div class="mb-20">
            <span>Mensaje: </span>
            <input type="text" v-model="mensaje" @keyup.enter="enviarMensaje">
          </div>
          <div>
            <span>Coordenadas: </span> {{x}} - {{y}}
          </div>
        </div>
      </div>
      <div class="bloque">
        <div class="bloque__caracteristica">
          <span>v-if, v-else, v-else-if, v-show</span>
        </div>
        <div class="bloque__contenido">
          <div v-if="pasaporte" class="exito">
            <span>¡Tienes Pasaporte!</span>
          </div>
          <div v-else-if="numeroHijos > 0" class="exito">
            <span>¡Tienes Hijos!</span>
          </div>
          <div v-else class="error">
            <span>Sin pasaporte y sin hijos</span>
          </div>
          <div v-show="pasaporte || numeroHijos > 0" class="exito">
            <span>!Puedes Pasar!</span>
          </div>
        </div>
      </div>
      <div class="bloque">
        <div class="bloque__caracteristica">
          <span>v-for</span>
        </div>
        <div class="bloque__contenido">
          <span><b>Intereses</b></span>
          <div v-for="(interes, index) in intereses" :key="index"
           class="mt-20" :class="interes.activo ? 'activo' : 'inactivo'">
            <span>{{interes.actividad}}</span>
            <button :class="interes.activo ? 'btn-inactivar' : 'btn-activar'"
              @click="cambiarEstado(interes)">
              <span v-if="!interes.activo">Activar</span>
              <span v-else>Inactivar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      mostrarDatos: 'Mostrar Datos - {{dato}}',
      titulo: 'Información de Usuario',
      nombres: 'Isaac',
      apellidos: 'Newton',
      fechaNacimiento: new Date(1994, 5, 15),
      urlBiografia: 'https://es.wikipedia.org/wiki/Isaac_Newton',
      pasaporte: true,
      email: "isaac.newton@gmail.com",
      numeroHijos: 0,
      mensaje: "",
      mensajeEnviado: "",
      x: 0,
      y: 0,
      intereses: [
        { actividad: 'Astronomía', activo: true },
        { actividad: 'Bailar', activo: false },
        { actividad: 'Cocinar', activo: true },
        { actividad: 'Física', activo: true },
        { actividad: 'Fútbol', activo: false },
        { actividad: 'Historia', activo: true },
        { actividad: 'Leer', activo: true },
        { actividad: 'Matemáticas', activo: true },
        { actividad: 'Natación', activo: false },
        { actividad: 'Ver Películas', activo: false }
      ]
    }
  },
  computed: {
    nombreCompleto() {
      return this.nombres + ' ' + this.apellidos
    },
    edad() {
      let fechaActual = new Date()
      let diferencia = fechaActual - this.fechaNacimiento
      return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25))
    },
    tienePasaporte() {
      return this.pasaporte ? 'Sí.' : 'No.'
    }
  },
  methods: {
    actualizarNumeroHijos(cantidad) {
      this.numeroHijos += cantidad

      if (this.numeroHijos < 0) {
        this.numeroHijos = 0
      }
    },
    enviarMensaje() {
      this.mensajeEnviado = this.mensaje
    },
    actualizarCoordenadas(event) {
      let recCoordenadas = this.$refs.coordenadas.getBoundingClientRect();
      this.x = Math.floor(event.clientX - recCoordenadas.left);
      this.y = Math.floor(event.clientY- recCoordenadas.top);
    },
    cambiarEstado(interes) {
      interes.activo = !interes.activo
    }
  }
}
</script>

<style>
.principal {
  background-color: #a851f1;
  width: 400px;
  border-radius: 20px;
  padding: 10px;
  margin: 10px;
}

.contenido {
  background-color: lightgray;
  padding: 10px;
  border-radius: 10px;
}

.bloque {
  margin: 10px;
  padding: 10px;
  background-color: white;
  opacity: 0.95;
  border-radius: 10px;
}

.bloque__caracteristica {
  font-size: 14pt;
  color: rgb(78, 78, 78);
  margin: 5px;
}

.bloque__contenido {
  font-size: 18pt;
  color: rgb(15, 15, 15);
  margin: 5px;
  padding: 5px;
}

.mt-20 {
  margin-top: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

a {
  text-decoration: none;
}

.exito {
  color: rgb(5, 121, 59) !important;
}

.error {
  color: rgb(240, 149, 30) !important;
}

.activo {
  color: rgb(5, 121, 59) !important;
  font-weight: bold;
}

.inactivo {
  color: darkgray !important;
  text-decoration: line-through;
}

input[type=text] {
  border-radius: 5px;
  font-size: 14pt;
}

button {
  cursor: pointer;
  margin: 3px 10px;
  font-weight: bold;  
  color: white;
  border-style: none;
  border-radius: 5px;
  padding: 3px 10px;
}

.btn-accion {  
  margin: 3px !important;
  background-color: #ff5b8b;
  font-size: 20pt;
  min-width: 36px;
}

.btn-activar { 
  background-color: #16b431; 
  font-size: 12pt;
}

.btn-inactivar {
  background-color: #f61748; 
  font-size: 12pt;
}
</style>

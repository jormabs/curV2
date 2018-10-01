<template>
  <v-layout align-start justify-center>
    <v-flex v-if="obra" xs12>
      <v-card class="obra pa-5">
        <v-card class="obra__descripcion elevation-3 pa-3">
          <v-card-text class="obra__descripcion-titulo" color="primary">
            <h2>{{obra.titulo}}</h2>
          </v-card-text>
          <img class="obra__descripcion-imagen" :src="obra.portada" />
          <v-card-text class="obra__descripcion-texto">
            {{obra.descripcion}}
          </v-card-text>
        </v-card>
        <v-card v-if="fechasDisponibles" class="obra__presentaciones elevation-0">
          <v-card-text class="obra__presentaciones-titulo" color="primary">
            <h3>Presentaciones Disponibles</h3>
          </v-card-text>
          <v-card-text class="obra__presentaciones-calendario">
            <v-date-picker ref="picker" class="elevation-3" :allowed-dates="validarFecha" :events="fechasActivas" v-model="fecha" :min="fechaMinima" :max="fechaMaxima"
            full-width :event-color="date => date < fechaActualyyyymmdd ? 'grey lighten-1' : 'green darken-1'" reactive locale="es-co" @change="buscarHorarios"></v-date-picker>
          </v-card-text>
          <v-card-text class="obra__presentaciones-horario">
            <div v-if="buscandoHorarios">
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </div>
            <div v-else>
              <v-btn v-for="presentacion in presentacionesDisponibles" :key="presentacion.pid" :to="{ path: presentacion.url }">
                {{ presentacion.descripcion }}
              </v-btn>
            </div>

          </v-card-text>
        </v-card>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { generarFormatoFecha, generarFormatoHora } from '@/utilidades/formatos'
import { db } from '@/firebase'

export default {
  data() {
    return {
      obra: null,
      fecha: null,
      fechasActivas: null,
      fechaActual: null,
      fechaMinima: null,
      fechaMaxima: null,
      fechasDisponibles: false,
      fechaActualyyyymmdd: null,
      presentacionesDisponibles: [],
      buscandoHorarios: false
    }
  },
  computed: {

  },
  methods: {
    validarFecha(fecha) {
      if (!this.fechasActivas) return false
      if (fecha < this.fechaActual) return false
      return this.fechasActivas.indexOf(fecha) !== -1
    },
    buscarHorarios() {
      this.buscandoHorarios = true

      let fechaSeleccionada = new Date(this.fecha)

      let fechaInicial = new Date(fechaSeleccionada.getTime() + fechaSeleccionada.getTimezoneOffset() * 60000)
      let fechaFinal = new Date(fechaSeleccionada.getTime() + fechaSeleccionada.getTimezoneOffset() * 60000)
      fechaFinal.setDate(fechaFinal.getDate() + 1)

      console.log({fechaInicial})
      console.log({fechaFinal})

      db.collection('obras')
      .doc(this.obra.oid)
      .collection('presentaciones')
      .where('fecha', '>', fechaInicial)
      .where('fecha', '<', fechaFinal)
      .get()
      .then(querySnapshot => {
        this.presentacionesDisponibles = querySnapshot.docs.map(doc => {
          const presentacion = doc.data()

          const fechaPresentacion = new Date(presentacion.fecha.seconds * 1000)

          return {
            pid: presentacion.pid,
            descripcion: `${generarFormatoFecha(fechaPresentacion, '-')} ${generarFormatoHora(fechaPresentacion)} - ${presentacion.teatro.nombre}`,
            url: `/${this.obra.oid}/${presentacion.teatro.tid}/${generarFormatoFecha(fechaPresentacion, '-', true)}`
          }
        })

        console.log(this.presentacionesDisponibles)

        this.buscandoHorarios = false
      })
    }
  },
  created() {
    let oid = this.$route.params.oid

    db.collection('obras')
      .doc(oid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          this.$router.push({ name: '404' })
        }

        this.fechaActual = new Date()
        this.fechaActual.setHours(0, 0, 0, 0)
        this.fechaActualyyyymmdd = generarFormatoFecha(new Date(this.fechaActual), '-')

        this.obra = doc.data()

        if (this.obra.fechas && this.obra.fechas.length > 0) {

          let fechasMilisegundos = this.obra.fechas.map(fecha => {
            return fecha.seconds * 1000
          })

          this.obra.fechas.sort((a, b) => { return a - b })

          let valorMinimoVigente = fechasMilisegundos.find(f => f >= this.fechaActual.getTime())

          if (!valorMinimoVigente) return

          this.fechaMinima = generarFormatoFecha(new Date(valorMinimoVigente), '-')
          this.fechaMaxima = generarFormatoFecha(new Date(fechasMilisegundos[fechasMilisegundos.length - 1]), '-')

          this.fechasActivas = fechasMilisegundos.map(fecha => {
            return generarFormatoFecha(new Date(fecha), '-')
          })

          this.fecha = this.fechaMinima

          this.buscarHorarios()

          this.fechasDisponibles = true
        }
      })
  }

}
</script>

<style scoped>
.obra {
  display: grid;
  grid-template-areas: "descripcion presentaciones";

  grid-template-columns: min-content 1fr;
  justify-items: center;
  grid-gap: 30px;
}

.obra__descripcion {
  grid-area: descripcion;
  display: grid;
  grid-template-areas:
    "titulo"
    "imagen"
    "texto";

  justify-items: center;
  align-items: start;
}

.obra__descripcion-titulo {
  grid-area: titulo;
  font-size: 1.6em;
  text-align: center;
  color: #553f75;
  font-weight: 700;
}

.obra__descripcion-imagen {
  grid-area: imagen;
}

.obra__descripcion-texto {
  grid-area: texto;
}

.obra__presentaciones {
  grid-area: presentaciones;
  display: grid;
  grid-template-areas:
    "titulo"
    "calendario"
    "horario";

  grid-template-rows: min-content 1fr 1fr;

  align-items: start;
}

.obra__presentaciones-titulo {
  grid-area: titulo;
  font-size: 1.2em;
  text-align: center;
  font-weight: 700;
}

.obra__presentaciones-calendario {
  grid-area: calendario;
}

.obra__presentaciones-horarios {
  grid-area: horario;
  display: grid;
}
</style>



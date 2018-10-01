<template>
  <v-layout v-resize="onResize" justify-center>
    <div v-if="presentacion && presentacion.asientos" class="presentacion">
      <div class="presentacion__titulo">
        <h2>{{ presentacion.obra.titulo }}</h2>
        <h3>{{ presentacion.teatro.nombre }}</h3>
        <h4>{{ obtenerFechaPresentacion() }}</h4>
      </div>
      <div class="presentacion__leyendas">
        <div class="leyendas__leyenda">
          <div class="leyendas__leyenda-item">
            <v-icon color="grey darken-3" :size="22">
              add
            </v-icon>
            <span>Asiento Disponible</span>
          </div>
          <div class="leyendas__leyenda-item">
            <v-icon color="grey darken-3" :size="22">
              person
            </v-icon>
            <span>Asiento Ocupado</span>
          </div>
          <div class="leyendas__leyenda-item">
            <v-icon color="grey darken-3" :size="22">
              check_circle
            </v-icon>
            <span>Asiento Seleccionado</span>
          </div>
          <div class="leyendas__leyenda-item">
            <v-icon color="grey darken-3" :size="22">
              monetization_on
            </v-icon>
            <span>Asiento Pagado</span>
          </div>
        </div>
        <div class="leyendas__leyenda">
          <div v-for="categoria in categorias" :key="categoria.precio" class="leyendas__leyenda-item">
            <v-icon :color="categoria.color" :size="22">
              brightness_1
            </v-icon>
            <span>$ {{categoria.precio}}</span>
          </div>
        </div>
      </div>
      <v-slide-y-transition mode="out-in">
        <div v-if="seleccionados && seleccionados.length > 0" class="presentacion__seleccionadas">
          <h3 class="seleccionadas-titulo">Tu Reserva</h3>
          <div class="seleccionadas-lista">
            <v-chip :close="!asiento.cambiandoEstado" :color="asiento.cambiandoEstado ? '#D32F2F' : '#C0CA33'" text-color="white" v-for="(asiento, index) in seleccionados" :key="index" @input="seleccionarAsiento(asiento)">
              <v-avatar>
                <v-icon>check_circle</v-icon>
              </v-avatar>
              {{asiento.descripcion}}: $ {{asiento.precio}}
            </v-chip>
          </div>
          <v-btn color="primary" class="seleccionadas-total" @click="pagar">
            Pagar un Total de: $ {{totalSeleccionado.toLocaleString()}}
          </v-btn>
        </div>
      </v-slide-y-transition>
      <v-slide-y-transition mode="out-in">
        <div v-if="pagados && pagados.length > 0" class="presentacion__pagadas">
          <h4 class="pagadas-titulo">Compras Anteriores</h4>
          <div class="pagadas-lista">
            <v-chip v-for="(asiento, index) in pagados" :key="index" text-color="grey darken-1">
              <v-avatar>
                <v-icon color="grey darken-1">monetization_on</v-icon>
              </v-avatar>
              {{asiento.descripcion}}: $ {{asiento.precio}}
            </v-chip>
          </div>
          <div class="pagadas-total">
            Total: $ {{totalPagado.toLocaleString()}}
          </div>
        </div>
      </v-slide-y-transition>
      <v-card class="teatro">
        <div class="teatro__escenario">
          <span>Escenario</span>
        </div>
        <div class="teatro__asientos">
          <v-card v-for="asiento in presentacion.asientos" :key="asiento.descripcion" @click.native="seleccionarAsiento(asiento)" class="asiento" :class="obtenerCssAsiento(asiento.estado)" :style="'grid-column: ' + asiento.x + '; grid-row: ' + asiento.y + ';'" :color="obtenerColorAsiento(asiento.estado, asiento.color)">
            <v-icon v-if="!asiento.cambiandoEstado" :color="obtenerColorEstado(asiento.estado)" :size="size">
              {{obtenerIconoEstado(asiento.estado)}}
            </v-icon>
            <v-progress-circular v-else indeterminate :size="size" color="white"></v-progress-circular>
          </v-card>
        </div>
      </v-card>
    </div>
  </v-layout>
</template>

<script>
import { generarFormatoFecha, generarFormatoHora } from '@/utilidades/formatos'
import { db } from '@/firebase'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      teatro: {},
      obra: {},
      presentacion: {},
      categorias: [],
      seleccionados: [],
      totalSeleccionado: 0,
      pagados: [],
      totalPagado: 0,
      size: 28
    }
  },
  computed: {
    ...mapState(['usuario', 'teatros'])
  },
  created() {
    let oid = this.$route.params.oid
    let tid = this.$route.params.tid
    let fecha = this.$route.params.fecha

    let pid = `${oid}-${tid}-${fecha}`

    let presentacion = null

    db.collection('obras').doc(oid).get()
      .then(doc => {
        this.obra = doc.data()

        return db
          .collection('obras')
          .doc(oid)
          .collection('presentaciones')
          .doc(pid)
          .get()
      })
      .then(doc => {
        if (doc.exists) {
          presentacion = doc.data()

          this.teatro = this.teatros.find(t => t.tid == tid)

          let dicCategorias = {}

          this.categorias = []

          this.teatro.categorias.forEach(item => {
            dicCategorias[item.categoria] = { color: item.color, precio: this.obra.categorias.find(i => i.categoria == item.categoria).precio }
            this.categorias.push(dicCategorias[item.categoria])
          });

          let asientosPresentacion = this.teatro.asientos.map(asiento => {
            let precio = dicCategorias[asiento.categoria].precio
            let color = dicCategorias[asiento.categoria].color
            return { descripcion: asiento.descripcion, x: asiento.x, y: asiento.y, estado: 'disponible', precio, color, cambiandoEstado: false }
          })

          presentacion.asientos = asientosPresentacion

          this.presentacion = presentacion

          this.consultarReservas()
        }
        else {
          this.$router.push({ name: 'home' })
          return Promise.reject()
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    ...mapMutations(['mostrarError', 'mostrarExito', 'mostrarOcupado', 'ocultarOcupado']),
    onResize() {
      if (window.innerWidth < 400) {
        this.size = 7
      }
      else if (window.innerWidth < 500) {
        this.size = 9
      }
      else if (window.innerWidth < 600) {
        this.size = 12
      }
      else if (window.innerWidth < 900) {
        this.size = 13
      }
      else if (window.innerWidth < 1000) {
        this.size = 19
      }
      else if (window.innerWidth < 1200) {
        this.size = 24
      }
      else {
        this.size = 27
      }
    },
    consultarReservas() {
      db
        .collection('obras')
        .doc(this.obra.oid)
        .collection('presentaciones')
        .doc(this.presentacion.pid)
        .collection('reservas')
        .get()
        .then(query => {
          let reservas = []

          query.forEach(doc => {
            reservas.push(doc.data())
          });

          reservas.forEach(reserva => {
            let asiento = this.presentacion.asientos.find(a => a.x == reserva.x && a.y == reserva.y)

            asiento.usuario = reserva.usuario

            if (reserva.estado == 'pagado') {
              asiento.estado = 'pagado'
              this.pagados.push(asiento)
              this.totalPagado += asiento.precio
            }
            else if (reserva.uid == this.usuario.uid) {
              asiento.estado = 'seleccionado'
              this.seleccionados.push(asiento)
              this.totalSeleccionado += asiento.precio
            }
            else {
              asiento.estado = 'ocupado'
            }
          });
        })
    },
    obtenerFechaPresentacion() {
      if (!this.presentacion) return ''

      const fechaPresentacion = new Date(this.presentacion.fecha.seconds * 1000)
      return `${generarFormatoFecha(fechaPresentacion, '-')} ${generarFormatoHora(fechaPresentacion)}`
    },
    obtenerColorEstado(estado) {
      switch (estado) {
        case 'disponible':
          return '#fff'
        case 'seleccionado':
          return '#fff'
        case 'ocupado':
          return 'grey lighten-1'
        case 'pagado':
          return 'grey lighten-1'
      }
    },
    obtenerIconoEstado(estado) {
      switch (estado) {
        case 'disponible':
          return 'add'
        case 'seleccionado':
          return 'check_circle'
        case 'ocupado':
          return 'person'
        case 'pagado':
          return 'monetization_on'
      }
    },
    obtenerColorAsiento(estado, color) {
      switch (estado) {
        case 'disponible':
          return color
        case 'seleccionado':
          return '#C0CA33'
        case 'ocupado':
        case 'pagado':
          return '#E0E0E0'
      }
    },
    obtenerCssAsiento(estado) {
      switch (estado) {
        case 'disponible':
        case 'seleccionado':
          return 'asiento-cursor-pointer elevation-2'
        case 'ocupado':
        case 'pagado':
          return 'asiento-cursor-not-allowed elevation-0'
      }
    },
    seleccionarAsiento(asiento) {
      if (asiento.estado == 'ocupado' || asiento.estado == 'pagado' || asiento.cambiandoEstado) {
        return
      }

      asiento.cambiandoEstado = true

      if (asiento.estado == 'disponible') {
        let reserva = {
          rid: asiento.x + '-' + asiento.y,
          x: asiento.x,
          y: asiento.y,
          uid: this.usuario.uid
        }

        db.collection('obras')
          .doc(this.obra.oid)
          .collection('presentaciones')
          .doc(this.presentacion.pid)
          .collection('reservas')
          .doc(reserva.rid)
          .set(reserva)
          .then(() => {
            asiento.estado = 'seleccionado'
            this.seleccionados.push(asiento)
            this.totalSeleccionado += asiento.precio
            asiento.cambiandoEstado = false
          })
          .catch(() => {
            asiento.cambiandoEstado = false
          })
      }
      else {
        let rid = asiento.x + '-' + asiento.y
        db.collection('obras')
          .doc(this.obra.oid)
          .collection('presentaciones')
          .doc(this.presentacion.pid)
          .collection('reservas')
          .doc(rid)
          .delete()
          .then(() => {
            asiento.estado = 'disponible'
            this.seleccionados.splice(this.seleccionados.indexOf(asiento), 1)
            this.totalSeleccionado -= asiento.precio
            asiento.cambiandoEstado = false
          })
          .catch(() => {
            asiento.cambiandoEstado = false
          })
      }
    },
    pagar() {
      this.mostrarOcupado({ titulo: 'Efectuando Pago', mensaje: 'Se está validando tu pago, espera unos segundos...' })

      let batch = db.batch()

      let fecha = new Date()

      this.seleccionados.forEach(asiento => {
        let campos = { estado: 'pagado', fecha }

        batch.update(
          db.collection('obras')
            .doc(this.obra.oid)
            .collection('presentaciones')
            .doc(this.presentacion.pid)
            .collection('reservas')
            .doc(asiento.x + '-' + asiento.y), campos)
      });

      batch.commit()
        .then(() => {
          if (!this.pagados) {
            this.pagados = []
          }

          let recienPagados = this.seleccionados.map(asiento => {
            asiento.estado = 'pagado'
            asiento.fecha = fecha

            return asiento
          })

          this.pagados = this.pagados.concat(recienPagados)
          this.seleccionados = []
          this.totalSeleccionado = 0

          this.ocultarOcupado()
          this.mostrarExito('¡Gracias por preferir nuestro teatro Súper Ópera! Tu compra se ha efectuado con éxito.')
        })
        .catch(() => {
          this.ocultarOcupado()
          this.mostrarError('Ocurrió un error efectuando el pago. Inténtalo más tarde.')
        })
    }
  }
}
</script>

<style scoped>
.presentacion {
  display: grid;
  grid-template-areas:
    "titulo"
    "leyendas"
    "seleccionadas"
    "pagadas"
    "teatro";
  grid-gap: 1em;
}

.presentacion__titulo {
  grid-area: titulo;
  display: grid;
  font-size: 1.7em;
  text-align: center;
  justify-self: center;
  font-weight: 700;
  padding: 20px;
  color: #553f75;
}

.presentacion__leyendas {
  grid-area: leyendas;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-items: center;
  justify-self: center;
  grid-gap: 20px;
  padding: 10px;
}

.leyendas__leyenda {
  display: grid;
  align-items: center;
  padding: 10px;
  grid-gap: 5px;
}

.leyendas__leyenda-item {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: min-content 1fr;
  grid-gap: 5px;
}

.presentacion__seleccionadas {
  grid-area: seleccionadas;
  display: grid;
  grid-template-areas:
    "titulo"
    "lista"
    "total";
  grid-gap: 20px;
  justify-items: center;
  margin-bottom: 20px;
}

.seleccionadas-titulo {
  grid-area: titulo;
}

.seleccionadas-lista {
  grid-area: lista;
}

.seleccionadas-total {
  grid-area: total;
  font-size: 1.3em;
}

.presentacion__pagadas {
  grid-area: pagadas;
  display: grid;
  grid-template-areas:
    "titulo"
    "lista"
    "total";

  grid-gap: 20px;
  justify-items: center;
  margin-bottom: 20px;
}

.pagadas-titulo {
  grid-area: titulo;
}

.pagadas-lista {
  grid-area: lista;
}

.pagadas-total {
  grid-area: total;
  font-size: 1em;
}

.teatro {
  grid-area: teatro;
  display: grid;
  grid-template-areas:
    "escenario"
    "asientos";
  align-items: start;
  grid-template-rows: min-content min-content;
}

.teatro__escenario {
  display: grid;
  grid-area: escenario;
  justify-items: center;
  align-items: center;
  color: rgb(68, 68, 68);
  border-color: rgb(158, 158, 158);
  border-style: solid;
  border-width: 1px;
  padding-bottom: 30px;
  padding-top: 30px;
  font-size: 1.7em;
  border-bottom-left-radius: 50% !important;
  border-bottom-right-radius: 50% !important;
  margin: 10px;
}

.teatro__asientos {
  display: grid;
  grid-area: asientos;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  grid-gap: 12px;
  padding: 10px;
}

.asiento {
  display: grid;
  align-items: center;
  justify-items: center;
  padding: 10px;
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
  border-bottom-left-radius: 3px !important;
  border-bottom-right-radius: 3px !important;
}

.asiento-cursor-pointer {
  cursor: pointer;
}

.asiento-cursor-not-allowed {
  cursor: not-allowed;
}

@media only screen and (max-width: 1200px) {
  .presentacion__titulo {
    font-size: 1.5em;
  }

  .teatro__escenario {
    padding-bottom: 40px;
    padding-top: 40px;
    font-size: 1.3em;
  }

  .teatro__asientos {
    grid-gap: 6px;
  }

  .asiento {
    padding: 10px;
    border-radius: 8px 8px 2px 2px;
  }
}

@media only screen and (max-width: 1000px) {
  .asiento {
    padding: 8px;
    border-radius: 6px 6px 2px 2px;
  }

  .teatro__asientos {
    grid-gap: 6px;
  }
}

@media only screen and (max-width: 900px) {
  .teatro__escenario {
    padding-bottom: 35px;
    padding-top: 35px;
    font-size: 1.3em;
  }

  .teatro__asientos {
    grid-gap: 10px;
  }

  .asiento {
    padding: 6px;
    border-radius: 4px 4px 1px 1px;
  }
}

@media only screen and (max-width: 600px) {
  .presentacion__titulo {
    font-size: 1em;
  }

  .teatro__escenario {
    padding-bottom: 30px;
    padding-top: 30px;
    font-size: 1.2em;
  }

  .asiento {
    padding: 4px;
  }
}

@media only screen and (max-width: 400px) {
  .presentacion__titulo {
    font-size: 0.9em;
  }

  .teatro__escenario {
    padding-bottom: 20px;
    padding-top: 20px;
    /* font-size: 1.2em; */
  }

  .teatro__asientos {
    grid-gap: 4px;
    padding: 5px;
  }

  .asiento {
    padding: 3px;
  }
}
</style>

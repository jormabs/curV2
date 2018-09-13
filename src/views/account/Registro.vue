<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-slide-y-transition mode="out-in" @enter="enter">
        <v-card v-if="vista == 1" :key="vista" class="elevation-6">
          <v-toolbar dark color="secondary" card flat>
            <v-toolbar-title>
              Regístrate
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="Email" v-model="email" />
            <v-text-field label="Contraseña" v-model="password" type="password" />
          </v-card-text>
          <v-card-actions class="px-3 pb-3">
            <v-flex text-xs-right>
              <v-btn color="primary" @click="registrar">Siguiente</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
        <v-card v-if="vista == 2" :key="vista" class="elevation-6">
          <v-toolbar dark color="secondary" card flat>
            <v-toolbar-title>
              Completa tu información
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="Nombres" v-model="nombres" />
            <v-text-field label="Apellidos" v-model="apellidos" />
          </v-card-text>
          <v-card-actions class="px-3 pb-3">
            <v-flex text-xs-right>
              <v-btn @click="vista--">Atrás</v-btn>
              <v-btn color="primary" @click="seleccionarFecha">Siguiente</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
        <v-card v-if="vista == 3" :key="vista" class="elevation-6">
          <v-toolbar dark color="secondary" card flat>
            <v-toolbar-title>
              Ingresa tu fecha de nacimiento
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-flex text-xs-center>
              <v-date-picker ref="picker" class="elevation-3" v-model="fechaNacimiento" reactive locale="es-co" :min="minFecha" :max="maxFecha"></v-date-picker>
            </v-flex>
          </v-card-text>
          <v-card-actions class="px-3 pb-3">
            <v-flex text-xs-right>
              <v-btn @click="vista--">Atrás</v-btn>
              <v-btn color="primary" @click="guardar">Guardar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-slide-y-transition>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth, db } from '@/firebase'
export default {
  data() {
    return {
      vista: 1,
      email: '',
      password: '',
      credenciales: null,
      nombres: "",
      apellidos: "",
      fechaNacimiento: null
    }
  },
  computed: {
    minFecha() {
      let fechaActual = new Date()
      return new Date(fechaActual.setFullYear(fechaActual.getFullYear() - 100))
        .toISOString()
        .substring(0, 10)
    },
    maxFecha() {
      let fechaActual = new Date()
      return new Date(fechaActual.setFullYear(fechaActual.getFullYear() - 13))
        .toISOString()
        .substring(0, 10)
    }
  },
  methods: {
    registrar() {
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(credenciales => {
          this.credenciales = credenciales.user

          console.log(this.credenciales)
          this.vista++
        })
        .catch(error => {
          console.log(error)
        })
    },
    seleccionarFecha() {
      this.vista = 3
    },
    guardar() {
      let usuario = {
        uid: this.credenciales.uid,
        nombres: this.nombres,
        apellidos: this.apellidos,
        fechaNacimiento: new Date(this.fechaNacimiento)
      }

      db
        .collection("usuarios")
        .doc(usuario.uid)
        .set(usuario)
        .then(() => {
          return db.collection("usuarios").doc(usuario.uid).get()
        })
        .then(doc => {
          if(doc.exists) {
            this.$store.commit("setUsuario", doc.data())
            this.$router.push({name: 'home'})
          }
          else {
            console.log("Error")
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    enter() {
      if (this.vista == 3) {
        this.$refs.picker.activePicker = "YEAR"
      }
    }
  }
}
</script>

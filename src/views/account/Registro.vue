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
            <v-text-field label="Email" v-model="form.email" :error-messages="emailErrors" @blur="$v.form.email.$touch()" />
            <v-text-field label="Contraseña" v-model="form.password" type="password" :error-messages="passwordErrors" @blur="$v.form.password.$touch()" />
            <v-text-field label="Repetir Contraseña" v-model="form.repetirPassword" type="password" :error-messages="repetirPasswordErrors" @keyup.enter="registrar" @blur="$v.form.repetirPassword.$touch()" />
          </v-card-text>
          <v-card-actions class="px-3 pb-3">
            <v-flex text-xs-right>
              <v-btn color="primary" :depressed="$v.form.$invalid" :disabled="$v.form.$invalid" @click="registrar">Ingresar</v-btn>
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
            <v-text-field label="Nombres" v-model="formNombres.nombres" :error-messages="nombresErrors" @blur="$v.formNombres.nombres.$touch()" />
            <v-text-field label="Apellidos" v-model="formNombres.apellidos" :error-messages="apellidosErrors" @blur="$v.formNombres.apellidos.$touch()" />
          </v-card-text>
          <v-card-actions class="px-3 pb-3">
            <v-flex text-xs-right>
              <v-btn @click="vista = 1">Atrás</v-btn>
              <v-btn color="primary" :depressed="$v.formNombres.$invalid" :disabled="$v.formNombres.$invalid" @click="seleccionarFecha">Siguiente</v-btn>
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
              <v-btn color="primary" :depressed="$v.fechaNacimiento.$invalid" :disabled="$v.fechaNacimiento.$invalid" @click="guardar">Guardar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-slide-y-transition>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth, db } from '@/firebase'
import { email, required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { letrasEspacios } from '@/helpers/validaciones'

export default {
  data() {
    return {
      vista: 1,
      credenciales: null,
      form: {
        email: '',
        password: '',
        repetirPassword: ''
      },
      formNombres: {
        nombres: "",
        apellidos: "",
      },
      fechaNacimiento: null
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if(!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.required && errors.push("El email es requerido.")
      !this.$v.form.email.email && errors.push("Debes ingresar una dirección de email válida.")
      return errors
    },
    passwordErrors() {
      const errors = []
      if(!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required && errors.push("El password es requerido.")
      !this.$v.form.password.minLength && errors.push("La contraseña debe ser de al menos 6 cifras.")
      !this.$v.form.password.maxLength && errors.push("La contraseña debe ser de máximo 20 cifras.")
      return errors
    },
    repetirPasswordErrors() {
      const errors = []
      if(!this.$v.form.repetirPassword.$dirty) return errors
      !this.$v.form.repetirPassword.sameAs && errors.push("Las contraseñas no coinciden.")
      return errors
    },
    nombresErrors() {
      const errors = []
      if(!this.$v.formNombres.nombres.$dirty) return errors
      !this.$v.formNombres.nombres.required && errors.push("El nombre es requerido.")
      !this.$v.formNombres.nombres.minLength && errors.push("El nombre debe ser de al menos 3 cifras.")
      !this.$v.formNombres.nombres.maxLength && errors.push("El nombre debe ser de máximo 20 cifras.")
      !this.$v.formNombres.nombres.letrasEspacios && errors.push("El nombre debe contener solo letras y espacios.")
      return errors
    },
    apellidosErrors() {
      const errors = []
      if(!this.$v.formNombres.apellidos.$dirty) return errors
      !this.$v.formNombres.apellidos.required && errors.push("El apellido es requerido.")
      !this.$v.formNombres.apellidos.minLength && errors.push("El apellido debe ser de al menos 3 cifras.")
      !this.$v.formNombres.apellidos.maxLength && errors.push("El apellido debe ser de máximo 20 cifras.")
      !this.$v.formNombres.apellidos.letrasEspacios && errors.push("El apellido debe contener solo letras y espacios.")
      return errors
    },
    fechaNacimientoErrors() {
      const errors = []
      if(!this.$v.fechaNacimiento.$dirty) return errors
      !this.$v.fechaNacimiento.required && errors.push("La fecha de nacimiento es requerido.")
      return errors
    },
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
      if(this.$v.form.$invalid) {
        return
      }
      auth
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(credenciales => {
          this.credenciales = credenciales.user
          this.vista = 2
        })
        .catch(error => {
          console.log(error)
        })
    },
    seleccionarFecha() {
      if(!this.$v.formNombres.$invalid) {
        this.vista = 3
      }
    },
    guardar() {
      if(this.$v.fechaNacimiento.$invalid) {
        return
      }

      let usuario = {
        uid: this.credenciales.uid,
        nombres: this.formNombres.nombres,
        apellidos: this.formNombres.apellidos,
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
          if (doc.exists) {
            this.$store.commit("setUsuario", doc.data())
            this.$router.push({ name: 'home' })
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
  },
  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(6), maxLength: maxLength(20) },
      repetirPassword: { sameAs: sameAs('password')}
    },
    formNombres: {
      nombres: { required, minLength: minLength(3), maxLength: maxLength(20), letrasEspacios },
      apellidos: { required, minLength: minLength(3), maxLength: maxLength(20), letrasEspacios }
    },
    fechaNacimiento: { required }
  }
}
</script>

<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card class="elevation-6">
        <v-toolbar dark color="secondary" card flat>
          <v-toolbar-title>
            Ingresa
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field label="Email" v-model="form.email" :error-messages="emailErrors" @blur="$v.form.email.$touch()" />
          <v-text-field label="Contraseña" v-model="form.password" type="password" :error-messages="passwordErrors" @keyup.enter="ingresar" @blur="$v.form.password.$touch()" />
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn color="primary" :depressed="$v.form.$invalid" :disabled="$v.form.$invalid"  @click="ingresar">Ingresar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script scoped>
import { auth, firebase } from '@/firebase'
import { mapMutations } from 'vuex'
import { email, required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
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
    }
  },
  methods: {
    ...mapMutations(['setUsuario']),
    ingresar() {
      
      if(this.$v.form.$invalid) {
        return
      }

      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL) // | LOCAL | SESSION | NONE | Si es LOCAL no es necesaria esta instrucción ya que es el valor por defecto.
        .then(() => {
          return auth.signInWithEmailAndPassword(this.form.email, this.form.password)
        })
        .then(() => {
          // auth.currentUser.getIdToken(true).then(idToken => {
          //   console.log(idToken)
          // }).catch(function (error) {
          //   console.log(error)
          // })

          this.$router.push(this.$route.query.redirect || "/");

        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(6), maxLength: maxLength(20) }
    }
  }
}
</script>

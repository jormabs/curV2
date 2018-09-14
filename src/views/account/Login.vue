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
          <v-text-field label="Email" v-model="email" />
          <v-text-field label="Contraseña" v-model="password" type="password" />
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn color="primary" @click="ingresar">Ingresar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth, firebase } from '@/firebase'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    ...mapMutations(['setUsuario']),
    ingresar() {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL) // | LOCAL | SESSION | NONE | Si es LOCAL no es necesaria esta instrucción ya que es el valor por defecto.
        .then(() => {
          return auth.signInWithEmailAndPassword(this.email, this.password)
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
  }
}
</script>

<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card>
        <v-toolbar dark color="secondary">
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
import { auth, db } from '@/firebase'

export default {  
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    ingresar() {    
      auth.signInWithEmailAndPassword(this.email, this.password)
      .then(credenciales => {
        return db.collection("usuarios").doc(credenciales.user.uid).get()
      }) 
      .then(usuario => {
        console.log(usuario.data())
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<template>
  <v-app>
    <v-toolbar color="secondary" dark>
      <v-toolbar-title>
        <router-link class="blanco" :to="{ name: 'home' }">{{titulo}}</router-link>        
      </v-toolbar-title>
      <v-spacer></v-spacer>      
      <router-link v-if="!usuario" class="mr-3 blanco" :to="{ name: 'registro' }">Regístrate</router-link>
      <router-link v-if="!usuario" class="blanco" :to="{ name: 'login' }">Login</router-link>
      <span class="mr-3 blanco">{{edad}}</span>
      <a v-if="usuario" @click="salir" class="blanco">Salir</a>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <!-- <router-view @usuarioAutenticado="almacenarUsuario" /> -->
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer color="secondary" dark>
      <v-flex text-xs-center class="pa-3">
        <span>Curso Vue.js y Firebase 2018</span>
      </v-flex>      
    </v-footer>
  </v-app>
</template>
<script>

import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      titulo: 'Lienzos'
    }
  },
  computed: {
    ...mapState(['usuario']),
    ...mapGetters(['edad']),

    usuarioConvencional() {
      return this.$store.state.usuario // Llamado convencional al state, equivalente a ...mapState(['usuario'])
    }
  },
  methods: {
    // almacenarUsuario(usuario) {
    //   this.usuario = usuario
    //   this.$router.push({ name: 'home'})
    // },
    // salir() {
    //   this.$store.dispatch("salir") // Llamado convencional a actions en vuex
    // },
    ...mapActions(['salir'])
    
  }
}
</script>

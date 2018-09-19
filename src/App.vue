<template>
  <v-app>
    <v-navigation-drawer clipped v-model="drawer" fixed app temporary>
      <v-list>
        <v-list-tile replace :to="{ name: 'home' }" exact>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title  color="black" class="font-weight-700" v-text="'Inicio'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="usuario" :to="{ name: 'ejemplo' }">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            <v-list-tile-title color="black" class="font-weight-700" v-text="'Ejemplo'"></v-list-tile-title>
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="usuario" :to="{ name: 'perfil', params: { uid: usuario.uid} }">
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            <v-list-tile-title color="black" class="font-weight-700" v-text="'Perfil'"></v-list-tile-title>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="secondary" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
        <v-slide-y-transition mode="out-in">
          <!-- <router-view @usuarioAutenticado="almacenarUsuario" /> -->
        <router-view :key="$route.fullPath"></router-view>
        </v-slide-y-transition>        
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
      drawer: false,
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

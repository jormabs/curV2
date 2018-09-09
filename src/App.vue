<template>
  <v-app>
    <v-toolbar color="secondary" dark>
      <v-toolbar-title>
        <router-link class="blanco" :to="{ name: 'home' }">{{titulo}}</router-link>        
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link class="mr-3 blanco" :to="{ name: 'registro' }">Regístrate</router-link>
      <router-link class="blanco" :to="{ name: 'login' }">Login</router-link>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <router-view />
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

export default {
  name: 'App',
  data () {
    return {
      titulo: 'Lienzos'
    }
  }
}
</script>

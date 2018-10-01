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
      <router-link v-if="usuario" :to="{ path: '/users/' + usuario.uid}" class="usuario-toolbar">
        <img :src="fotoPerfil" :alt="usuario.nombres" class="usuario-toolbar-imagen">
        <span class="usuario-toolbar-nombres">{{usuario.nombres}}</span>
      </router-link>
      <a v-if="usuario" @click="salir" class="blanco">Salir</a>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
        <router-view :key="$route.fullPath"></router-view>
        </v-slide-y-transition>        
      </v-container>      
    </v-content>
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" multi-line :timeout="6000" top dark>
      {{ snackbar.mensaje }}
      <v-btn color="white" flat @click="ocultarMensaje">
        Cerrar
      </v-btn>
    </v-snackbar>
     <v-dialog v-model="ocupado.activo" max-width="400">
      <v-card>
        <v-toolbar dark color="primary" card flat>
          <v-toolbar-title class="white--text">{{ocupado.titulo}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="subheading">
          {{ocupado.mensaje}}
        </v-card-text>
        <v-card-text>
          <v-progress-linear :indeterminate="true" color="primary"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>    
    <v-footer color="secondary" dark>
      <v-flex text-xs-center>
        <span>Curso Vue.js y Firebase 2018</span>
      </v-flex>      
    </v-footer>
  </v-app>
</template>
<script>

import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      drawer: false,
      titulo: 'Súper Ópera'
    }
  },
  computed: {
    ...mapState(['usuario', 'ocupado', 'snackbar']),
    ...mapGetters(['fotoPerfil'])
  },
  methods: {
    ...mapMutations(['ocultarMensaje']),
    ...mapActions(['salir'])    
  }
}
</script>

<style scoped>

.usuario-toolbar {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  align-items: center;
  margin-right: 10px;
}

.usuario-toolbar-imagen {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.usuario-toolbar-nombres {
  color: white;
}

</style>


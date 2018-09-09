<template>
  <v-app>
    <v-toolbar color="secondary" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        {{titulo}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <home />
    </v-content>
    <v-footer color="secondary" dark>
      <v-flex text-xs-center class="pa-3">
        <span>Curso Vue.js y Firebase 2018</span>
      </v-flex>      
    </v-footer>
  </v-app>
</template>
<script>
import Home from '@/views/Home.vue'

export default {
  name: 'App',
  data () {
    return {
      titulo: 'Lienzos'
    }
  },
  components: {
    Home: Home
  }
}
</script>

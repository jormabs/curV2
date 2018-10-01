<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card class="elevation-6">
        <v-card-text color="primary" class="notFound-titulo">
          No encontramos la página que buscabas
        </v-card-text>
        <v-card-text color="primary" class="notFound-texto">
          Verifica que la url ingresada sea correcta.
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-center>
            <v-btn color="primary" :to="{ name: 'home'}">Regresar al Inicio</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped>
.notFound-titulo {
  font-size: 2em;
}

.notFound-texto {
font-size: 1.4em;
}
</style>




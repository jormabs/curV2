<template>
  <v-container fluid align-start fill-height>
    <v-layout column>
      <v-layout justify-center align-start class="titulo-home">
        <h1>Súper Ópera</h1>
      </v-layout>
      <v-layout row xs12 wrap justify-center>
        <v-flex xs12 sm6 md4 lg3 v-for="obra in obras" :key="obra.oid">
          <v-card class="elevation-5 ma-3" :to="{ path: 'obras/' + obra.oid }">
            <v-img :src="obra.portada">
              <v-layout align-end fill-height>
                <v-spacer></v-spacer>
                <v-card-text class="obra-titulo text-xs-center">
                  {{obra.titulo}}
                </v-card-text>
              </v-layout>
            </v-img>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import { db } from '@/firebase'

export default {
  data() {
    return {
      obras: []
    }
  },
  created() {
    let vm = this

    db.collection("obras")
      .where("activo", "==", true)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          vm.obras.push(doc.data())
        });
      })
  },
  methods: {
    detalles(oid) {

    }
  }
}
</script>

<style scoped>
.titulo-home {
  font-family: "Great Vibes", cursive;
  font-size: 2.5em;
  color: #553F75;
  text-shadow: 1px 1px 5px #acacac;
}

/* @media only screen and (max-width: 900px) {
  .titulo-home {
    font-size: 24pt;
  }
} */

/* @media only screen and (max-width: 600px) {
  .titulo-home {
    font-size: 20pt;
  }
} */

.obra-titulo {
  font-size: 2.4em;
  color: rgb(255, 255, 255);
  opacity: 0.9;
  vertical-align: end;
}

/* styles for '...' */
.block-with-text {
  /* hide text if it more than N lines  */
  overflow: hidden;
  /* for set '...' in absolute position */
  position: relative;
  /* use this value to count block height */
  line-height: 1.2em;
  /* max-height = line-height (1.2) * lines max number (3) */
  height: 8em;
  /* fix problem when last visible word doesn't adjoin right side  */
  text-align: justify;
  /* place for '...' */
  margin-right: -1em;
  padding-right: 1em;
}
/* create the ... */
.block-with-text:before {
  /* points in the end */
  content: "...";
  /* absolute position */
  position: absolute;
  /* set position to right bottom corner of block */
  right: 0;
  bottom: 0;
}
/* hide ... if we have text, which is less than or equal to max lines */
.block-with-text:after {
  /* points in the end */
  content: "";
  /* absolute position */
  position: absolute;
  /* set position to right bottom corner of text */
  right: 0;
  /* set width and height */
  width: 1em;
  height: 1em;
  margin-top: 0.2em;
  /* bg color = bg color under block */
  background: white;
}
</style>


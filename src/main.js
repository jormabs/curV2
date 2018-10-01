import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import vuelidate from 'vuelidate'
import {
  auth,
  db,
  storage
} from './firebase'
import './registerServiceWorker'
import './styles/main.scss'

Vue.use(vuelidate)

Vue.config.productionTip = false

var vue = null

auth.onAuthStateChanged(auth => {
  if (auth) {
    db.collection("usuarios")
      .doc(auth.uid)
      .get()
      .then(doc => {
        if (doc.exists) {

          let usuario = doc.data()
          store.commit("setUsuario", usuario)

          if (usuario.fotoPerfilId) {
            storage
              .ref()
              .child("usuarios/" + usuario.uid + "/fotos-perfil/perfil-512x512.jpg")
              .getDownloadURL()
              .then(url => {
                console.log(url)
                store.commit("setFotoPerfil", url)
              })
              .catch(() => {
                store.commit("mostarEror", { mensaje: "No fue posible recuperar tu foto de perfil." })
              })

          }
        }

        inicializarVue()
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    store.dispatch("salir")
    inicializarVue()
  }

  if (!store.state.teatros) {
    db.collection('teatros')
      .get()
      .then(querySnapshot => {
        let teatros = []
        querySnapshot.forEach(doc => {
          teatros.push(doc.data())
        });

        store.commit('setTeatros', teatros)
      })
  }
})

function inicializarVue() {
  if (!vue) {
    vue = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
}
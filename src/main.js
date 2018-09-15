import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import vuelidate from 'vuelidate'
import {
  auth,
  db
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
      .then(usuario => {
        if(usuario.exists) {
          store.commit("setUsuario", usuario.data())
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
})

function inicializarVue() {
  if(!vue) {
    vue = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
}
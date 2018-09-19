import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from "@/firebase"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fotoPerfilDefecto512: 
    {
      size: 512,
      url: require('@/assets/fotoUsuario512.png')
    },
    usuario: null
  },
  mutations: {
    setUsuario(state, usuario) {
      state.usuario = usuario
    }
  },
  actions: {
    salir({ commit }) {
      auth.signOut()
      .then(() => {
        commit("setUsuario", null)
      })
      .catch(err => {
        console.log(err)
      })      
    }
  },
  getters: {
    edad(state) {
      if(!state.usuario) return ""
      let fechaActual = new Date()
      let diferencia = fechaActual - new Date(state.usuario.fechaNacimiento.seconds * 1000)
      return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25)).toString()
    }
  }
})

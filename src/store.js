import Vue from 'vue'
import Vuex from 'vuex'
import {
  auth
} from "@/firebase"
//import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fotoPerfilDefecto512: {
      size: 512,
      url: require('@/assets/fotoUsuario512.png')
    },
    usuario: null,
    snackbar: {
      visible: false,
      mensaje: ''
    },
    ocupado: {
      activo: false,
      titulo: "",
      mensaje: ""
    }
  },
  mutations: {
    setUsuario(state, usuario) {
      state.usuario = usuario
    },
    setNombres(state, payload) {
      state.usuario.nombres = payload.nombres
      state.usuario.apellidos = payload.apellidos
    },
    setFotoPerfil(state, fotoPerfil) {
      state.usuario.fotoPerfil512 = fotoPerfil
    },
    mostrarExito(state, mensaje) {
      state.snackbar.color = "success"
      state.snackbar.mensaje = mensaje
      state.snackbar.visible = true
    },
    mostrarInfo(state, mensaje) {
      state.snackbar.color = "info"
      state.snackbar.mensaje = mensaje
      state.snackbar.visible = true
    },
    mostrarAdvertencia(state, mensaje) {
      state.snackbar.color = "warning"
      state.snackbar.mensaje = mensaje
      state.snackbar.visible = true
    },
    mostrarError(state, mensaje) {
      state.snackbar.color = "error"
      state.snackbar.mensaje = mensaje
      state.snackbar.visible = true
    },
    ocultarMensaje(state) {
      state.snackbar.visible = false
      state.snackbar.mensaje = ''
    },
    mostrarOcupado(state, payload) {
      state.ocupado.titulo = payload.titulo
      state.ocupado.mensaje = payload.mensaje
      state.ocupado.activo = true
    },
    ocultarOcupado(state) {
      state.ocupado.titulo = ""
      state.ocupado.mensaje = ""
      state.ocupado.activo = false
    }
  },
  actions: {
    salir({
      commit
    }) {
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
      if (!state.usuario) return ""
      let fechaActual = new Date()
      let diferencia = fechaActual - new Date(state.usuario.fechaNacimiento.seconds * 1000)
      return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25)).toString()
    },
    fotoPerfil512(state) {
      if (!state.usuario || !state.usuario.fotoPerfil512) {
        return state.fotoPerfilDefecto512
      } else {
        return state.usuario.fotoPerfil512
      }
    }
  }
})
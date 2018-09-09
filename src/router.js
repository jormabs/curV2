import Vue from 'vue'
import Router from 'vue-router'

import Ejemplo from './components/Ejemplo.vue'

import Home from './views/Home.vue'

import Login from './views/account/Login.vue'
import Registro from './views/account/Registro.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/ejemplo',
      name: 'ejemplo',
      component: Ejemplo
    },
    {
      path: '/account/registro',
      name: 'registro',
      component: Registro
    }, 
    {
      path: '/account/login',
      name: 'login',
      component: Login
    }
  ]
})

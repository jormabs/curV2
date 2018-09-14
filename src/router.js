import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

import Ejemplo from './components/Ejemplo.vue'

import Home from './views/Home.vue'

import Login from './views/account/Login.vue'
import Registro from './views/account/Registro.vue'
import Perfil from './views/account/Perfil.vue'

Vue.use(Router)

var router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      // beforeEnter: (to, from, next) => {
      //   if(store.state.usuario) {
      //     next()
      //   }
      //   else {
      //     next({
      //       name: 'login'
      //     })
      //   }
      // }
      path: '/ejemplo',
      name: 'ejemplo',
      component: Ejemplo,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: Perfil,
      meta: {
        requiresAuth: true
      }
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.usuario) {
      next()
    } else {
      next({
        name: 'login'
      })
    }    
  }

  next()
})

export default router
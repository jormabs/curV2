import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

import Ejemplo from './components/Ejemplo.vue'

import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

import Login from './views/account/Login.vue'
import Registro from './views/account/Registro.vue'
import Perfil from './views/usuarios/Perfil.vue'
import Listas from './views/admin/Listas.vue'
import Obra from './views/teatro/Obra.vue'
import Presentacion from './views/teatro/Presentacion.vue'

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
      path: '/ejemplo',
      name: 'ejemplo',
      component: Ejemplo,
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
    },
    {
      path: '/admin/listas',
      name: 'listas',
      component: Listas
    },
    {
      path: '/users/:uid',
      name: 'perfil',
      component: Perfil,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/obras/:oid',
      name: 'obra',
      component: Obra
    },
    {
      path: '/:oid/:tid/:fecha',
      name: 'presentacion',
      component: Presentacion
    },
    {
      path: '/404',
      name: '404',
      component: NotFound
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.usuario) {
      next()
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }

  next()
})

export default router
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import Authorize from '../views/Authorize.vue';
import Login from '../views/Login.vue';
import Preparazioni from '../views/Preparazioni.vue';
import Ricetta from '../views/Ricetta.vue';
import Sezioni from '../views/Sezioni.vue';
import Cisterne from '../views/Cisterne.vue';
import ListaIrrigazioni from '../views/ListaIrrigazioni.vue';
import ListaFerti from '../views/ListaFerti.vue';
import ListaPreparazioni from '../views/ListaPreparazioni.vue';
import LoginQR from '../views/LoginQR.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/authorize',
    name: 'Authorize',
    component: Authorize
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/login_with_qr',
    name: 'LoginQR',
    component: LoginQR
  },
  {
    path: '/preparazioni',
    name: 'Preparazioni',
    component: Preparazioni
  },
  {
    path: '/sezioni',
    name: 'Sezioni',
    component: Sezioni
  },
  {
    path: '/cisterne',
    name: 'Cisterne',
    component: Cisterne
  },
  {
    path: '/ricetta:ricettasel:fasesel:sedesel:cd_deposito',
    name: 'Ricetta',
    component: Ricetta
  },
  {
    path: '/listairrigazioni',
    name: 'ListaIrrigazioni',
    component: ListaIrrigazioni
  },
  {
    path: '/listaferti',
    name: 'ListaFerti',
    component: ListaFerti
  },
  {
    path: '/listaprep',
    name: 'ListaPreparazioni',
    component: ListaPreparazioni
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

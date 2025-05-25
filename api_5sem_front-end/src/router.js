import { createRouter, createWebHistory } from 'vue-router';
import TelaHome from './components/TelaHome.vue'; 
import TelaDashboardOperador from './components/TelaDashboardOperador.vue';
import TelaLogin from './components/TelaLogin.vue';
import TelaDashboardGestor from './components/TelaDashboardGestor.vue';
import TelaDashboardAdmin from './components/TelaDashboardAdmin.vue';

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: TelaHome
  },
  {
    path: '/ResultadosDoOperador',
    name: 'ResultadosDoOperador',
    component: TelaDashboardOperador
  },
  {
    path: '/ResultadosDoGestor',
    name: 'ResultadosDoGestor',
    component: TelaDashboardGestor
  },
  {
    path: '/ResultadosDoAdmin',
    name: 'ResultadosDoAdmin',
    component: TelaDashboardAdmin
  },
  {
    path: '/',
    name: 'TelaDeLogin',
    component: TelaLogin
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
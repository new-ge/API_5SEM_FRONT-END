import { createRouter, createWebHistory } from 'vue-router';
import TelaHome from './components/TelaHome.vue'; 
import TelaDashboardOperador from './components/TelaDashboardOperador.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TelaHome
  },
  {
    path: '/ResultadosDoOperador',
    name: 'ResultadosDoOperador',
    component: TelaDashboardOperador
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

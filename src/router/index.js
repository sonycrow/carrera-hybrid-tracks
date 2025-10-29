import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HybridView from '../views/HybridView.vue';
import FoamView from '../views/FoamView.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/hybrid',
    name: 'Hybrid',
    component: HybridView,
  },
  {
    path: '/foam',
    name: 'Foam',
    component: FoamView,
  },
];

const router = createRouter({
  history: createWebHashHistory('/carrera-hybrid-tracks/dist/'),
  routes,
  linkActiveClass: 'bg-gray-200 dark:bg-gray-700'
});

export default router;
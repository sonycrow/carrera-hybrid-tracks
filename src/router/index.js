import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TracksView from '../views/TracksView.vue';

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
    path: '/tracks',
    name: 'Tracks',
    component: TracksView,
  },
];

const router = createRouter({
  history: createWebHashHistory('/carrera-hybrid-tracks/dist/'),
  routes,
  linkActiveClass: 'bg-gray-200 dark:bg-gray-700'
});

export default router;
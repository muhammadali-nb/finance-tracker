import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [

  {
    path: '/',
    name: 'main',
    component: () => import('@/pages/Main.vue'),
    meta: {
      layout: 'Default',
    },
  },

  {
    path: '/example',
    name: 'example',
    component: () => import('@/pages/Example.vue'),
    meta: {
      layout: 'Default',
    },
  },

  {
    path: '/status/:type',
    name: 'status',
    component: () => import('@/pages/StatusPage.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/Page404.vue'),
    meta: {
      layout: 'Empty',
    },
  },
];

export default routes;

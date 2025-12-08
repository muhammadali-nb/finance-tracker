import { createRouter, createWebHistory } from 'vue-router';
import { layoutMiddleware } from '@/middlewares/layoutMiddleware.ts';
// import { pageTransitionMiddleware } from '@/middlewares/pageTransitionMiddleware.ts';
import routes from './routes.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(layoutMiddleware);
// router.beforeEach(pageTransitionMiddleware);
export default router;

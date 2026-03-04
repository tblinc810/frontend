import { createRouter, createWebHistory } from 'vue-router';
import { useCloudStore } from '../stores/cloud';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: () => import('../views/LandingView.vue'),
      meta: { public: true }
    },
    { path: '/landing', component: () => import('../views/LandingView.vue'), meta: { public: true } },
    { path: '/login', component: () => import('../views/LoginView.vue'), meta: { public: true } },
    { path: '/dashboard', component: () => import('../views/DashboardView.vue'), name: 'dashboard' },
    { path: '/instances', component: () => import('../views/InstancesView.vue') },
    { path: '/instances/create', component: () => import('../views/CreateInstanceView.vue') },
    { path: '/baremetal/create', component: () => import('../views/CreateBaremetalView.vue') },
    { path: '/volumes', component: () => import('../views/VolumesView.vue') },
    { path: '/network', component: () => import('../views/NetworkView.vue') },
    { path: '/images', component: () => import('../views/ImagesView.vue') },
  ]
});

router.beforeEach((to) => {
  const store = useCloudStore();
  const hostname = window.location.hostname;

  // Global Redirect for cloud subdomain root
  if (hostname.startsWith('cloud.') && to.path === '/') {
    return store.isAuthenticated ? '/dashboard' : '/login';
  }

  if (!to.meta.public && !store.isAuthenticated) {
    return '/login';
  }
});

export default router;

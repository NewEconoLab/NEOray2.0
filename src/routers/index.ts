import asyncComponent from '@/components/asyncComponent';
// import redirectComponent from '@/components/redirectComponent';

export default [
  {
    component: asyncComponent(() => import('../containers/file')),
    exact: true,
    path: '/file',
  },
  {
    component: asyncComponent(() => import('../containers/deploy')),
    exact: true,
    path: '/deploy',
  },
  {
    component: asyncComponent(() => import('../containers/debug')),
    exact: true,
    path: '/debug',
  },
  {
    component: asyncComponent(() => import('../containers/invoke')),
    exact: true,
    path: '/invoke',
  },
  {
    component: asyncComponent(() => import('../containers/support')),
    exact: true,
    path: '/support',
  },
  {
    component: asyncComponent(() => import('../containers/notfound')),
    path: '/:any',
  },
  {
    component: asyncComponent(() => import('../containers/file')),
    exact: true,
    path: '/',
  },
];
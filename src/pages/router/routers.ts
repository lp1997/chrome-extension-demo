export const routerMain = [
  {
    path: '/Test',
    title: '测试',
    name: 'Test',
    component: () => import(/* webpackChunkName: "Test" */ '@/pages/components/pages/Test.vue')
  }
]

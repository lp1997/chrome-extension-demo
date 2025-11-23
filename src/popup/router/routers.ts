import { pageTabs } from '@/popup/typeList'
export const routerMain: pageTabs[] = [
  {
    path: '/',
    title: '页面信息',
    name: 'PageHello',
    isCom: true, // 不可隐藏
    component: () => import(/* webpackChunkName: "PageHello" */ '@/popup/components/pages/pageInfo.vue')
  },
  {
    path: '/pageMine',
    title: '个人中心',
    name: 'pageMine',
    isCom: true, // 不可隐藏
    component: () => import(/* webpackChunkName: "pageMine" */ '@/popup/components/pages/pageMine.vue')
  },
  {
    path: '/pageDescInfo',
    title: '版本记录',
    name: 'pageDescInfo',
    component: () => import(/* webpackChunkName: "pageDescInfo" */ '@/popup/components/pages/funcPages/pageDescInfo.vue')
  },
  {
    path: '/pageMemorandum',
    title: '备忘提醒',
    name: 'pageMemorandum',
    component: () => import(/* webpackChunkName: "pageMemorandum" */ '@/popup/components/pages/funcPages/pageMemorandum.vue')
  }
]

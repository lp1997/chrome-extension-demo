import { pageTabs } from '@/popup/typeList'
export const routerMain: pageTabs[] = [
  {
    path: '/',
    title: '页面信息',
    name: 'PageInfo',
    isCom: true, // 不可隐藏
    component: () => import(/* webpackChunkName: "PageInfo" */ '@/popup/views/pages/PageInfo.vue')
  },
  {
    path: '/PageMine',
    title: '个人中心',
    name: 'PageMine',
    isCom: true, // 不可隐藏
    component: () => import(/* webpackChunkName: "PageMine" */ '@/popup/views/pages/PageMine.vue')
  },
  {
    path: '/PageDescInfo',
    title: '版本记录',
    name: 'PageDescInfo',
    component: () => import(/* webpackChunkName: "PageDescInfo" */ '@/popup/views/pages/funcPages/PageDescInfo.vue')
  },
  {
    path: '/PageMemorandum',
    title: '备忘提醒',
    name: 'PageMemorandum',
    component: () => import(/* webpackChunkName: "PageMemorandum" */ '@/popup/views/pages/funcPages/PageMemorandum.vue')
  }
]

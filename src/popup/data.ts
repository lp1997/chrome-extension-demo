import { tableDataType, storageDataListType } from './typeList'
const getVersionList = require('../../version-list')
// 本地缓存数据列表
export const storageDataList:storageDataListType = {
  selTypeList: {
    name: '个人中心-页面配置-选择使用的页面数据',
    sort: 2001
  },
  todayDataList: {
    name: '个人中心-时长统计列表数据',
    sort: 2002,
    ifNotExport: true // 不可导出的数据
  },
  urlStoreList: {
    name: '个人中心-浏览排行列表数据',
    sort: 2003
  },
  itemHiddenList: {
    name: '个人中心-模块隐藏',
    sort: 2004
  },
  wordListStorage: {
    name: '备忘提醒-备忘提醒数据',
    sort: 3001
  }
}

// 版本信息
export const versionList: tableDataType[] = getVersionList

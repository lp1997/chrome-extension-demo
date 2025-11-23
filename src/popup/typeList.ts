// background.ts
export interface dateDataListType {
  currentTime: number
  aliveTime: number
  date?: string
}
// data.ts
export type storageDataListType<T = string> = Record<string, { // 本地缓存数据列表
  sort: number
  name: T
  data?: T
  ifNotExport?: boolean
}>
export interface storageDataItemType<T = string> { // 本地缓存展示数据
  key: T
  desc: T
  dataStr: T
  sort: number
  ifNotExport?: boolean
}

// pages
export interface pageTabs<T = string> {
  path: T,
  name: T,
  title: T,
  component: () => Promise<any>
  isCom?: boolean,
}

export interface tableDataType<T = string> {
  title: T,
  type: T,
  version: T,
  link: T
  desc?: T,
}
export interface listItemType<T = string> {
  id?: number,
  name?: T,
  time?: T,
  gitLink?: T,
  devLink?: T,
  testLink?: T,
  releaseLink?: T,
  isAdd?: boolean,
}

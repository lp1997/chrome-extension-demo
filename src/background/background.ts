import {
  localGet,
  localSet,
  getCurrentTabId,
  receiveData,
  sendMsgToTabById
} from '@/utils/chromeUtils'
import { formatTime } from '@/utils/backgroundUtils'
import { dateDataListType } from '@/popup/typeList'
import './menu'
import './serviceWorker'

let dateDataList:dateDataListType[] = []
const BackGroundAll:any = {
  hasGetRequestList: {},
  remindDataList: null,

  init () {
    this.receiveDataAll()
    this.localGetAll()
  },

  receiveDataAll () {
    /** @description 接收plugins/main.js发送的消息并返回消息 */
    receiveData(async (request:any, sender:any, callback:Function) => { // 直接设置全局属性,插件页面可以直接获取
      if (request.dataType === 'doRemind') { // 备忘提醒
        this.remindDataList = request.data
        return
      }
      if (request.dataType === 'urlLog') { // 网址访问记录
        this.updateUrlStoreList(request.loadUrl)
        return
      }
      callback()
    })
  },

  /**
   * @description 获取时间记录信息并处理
   */
  localGetAll () {
    localGet(['todayDataList', 'wordListStorage']).then((res:any) => {
      const todayData:any = {}
      const today = formatTime('y-M-d')
      if (res.wordListStorage) {
        this.remindDataList = JSON.parse(res.wordListStorage) || []
      }
      if (res.todayDataList) { // 时间记录
        dateDataList = res.todayDataList ? JSON.parse(res.todayDataList) : []
        let todayDataSet: dateDataListType[] = []
        for (let i = 0; i < dateDataList.length; i++) {
          if (dateDataList[i].date === today) {
            todayDataSet = [...todayDataSet, dateDataList[i]]
          }
        }
        if (!todayDataSet.length) {
          todayData.aliveTime = 1
          todayData.date = today
          todayData.currentTime = Date.parse(new Date() + '')
          todayData.time = Date.parse(new Date() + '')
          dateDataList = [todayData, ...dateDataList].slice(0, 7)// 保存近7天数据
          localSet('todayDataList', JSON.stringify(dateDataList))
          this.timeAdd(5)
        } else {
          this.timeAdd(5)
        }
      } else {
        todayData.aliveTime = 1
        todayData.date = today
        todayData.currentTime = Date.parse(new Date() + '')
        todayData.time = Date.parse(new Date() + '')
        dateDataList = [todayData, ...dateDataList].slice(0, 7)// 保存近7天数据
        localSet('todayDataList', JSON.stringify(dateDataList))
        this.timeAdd(5)
      }
    })
  },

  /**
   * @description 获取链接打开记录
   */
  updateUrlStoreList (link:any) {
    localGet(['urlStoreList']).then((res:any) => {
      let urlStoreListLocal = res.urlStoreList ? JSON.parse(res.urlStoreList) : []
      const linkPath = (link.match(/\/\/[^?#]*/) || [])[0]
      let hasSame = false
      for (let i = 0; i < urlStoreListLocal.length; i++) {
        if (urlStoreListLocal[i].linkPath === linkPath) {
          urlStoreListLocal[i].link = link
          urlStoreListLocal[i].num++
          hasSame = true
          break
        }
      }
      if (!hasSame) {
        urlStoreListLocal = [...urlStoreListLocal, {
          link,
          linkPath,
          num: 1
        }]
      }
      urlStoreListLocal = urlStoreListLocal.sort((a:any, b:any) => b.num - a.num) // 按打开次数排序
      localSet('urlStoreList', JSON.stringify(urlStoreListLocal))
    })
  },

  /**
   * @description 更新记录时长
   */
  timeAdd (t:number) { // 每t秒更新记录时长
    setTimeout(() => {
      this.timeAdd(t)
      const timeData = new Date()
      const nowTime = Date.parse(timeData + '')
      if ((nowTime - dateDataList[0].currentTime) / 1000 > 30) { // 大于30s算不在，期间的时间不算
        dateDataList[0].currentTime = nowTime
      } else {
        dateDataList[0].aliveTime += (nowTime - dateDataList[0].currentTime) / 1000
        dateDataList[0].currentTime = nowTime
      }
      localSet('todayDataList', JSON.stringify(dateDataList))
      this.doRemind({ nowTime })
    }, t * 1000)
  },
  /**
   * @description 备忘提醒
   * @param { Number } nowTime 当前时间戳
   * @param { String } tips 提示内容
   */
  async doRemind ({ nowTime, tips }: any) {
    const that = this
    const tabId = await getCurrentTabId()
    if (tips) { // 直接提示内容
      sendMsgToTabById(tabId, { dataType: 'doRemind', data: { name: tips } }, function (cbData:any) {
        if (!cbData || (cbData && cbData.status !== 'succ')) { // 未成功提醒
          setTimeout(() => {
            that.doRemind({ tips })
          }, 30e3)
        }
      })
      return
    }
    const remindDataListData = this.remindDataList
    if (remindDataListData) { // 拿到备忘列表数据
      for (const el of remindDataListData) {
        if (Date.parse(el.time) <= nowTime && !el.hasShow) { // 有可以提醒但还没提醒的备忘
          el.hasShow = 1
          el.showStyle = 'del'
          sendMsgToTabById(tabId, { dataType: 'doRemind', data: el }, function (cbData:any) {
            if (!cbData || (cbData && cbData.status !== 'succ')) { // 未成功提醒
              setTimeout(() => {
                el.hasShow = 0
                el.showStyle = ''
                that.doRemind({ nowTime })
              }, 30e3)
            } else if (cbData && cbData.status === 'succ') { // 成功提示了才改状态
              localSet('wordListStorage', JSON.stringify(remindDataListData.sort((a:any, b:any) => a.id - b.id)))
            }
          })
        }
      }
    }
  }
}
BackGroundAll.init()

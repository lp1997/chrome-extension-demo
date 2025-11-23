import $ from 'jquery'
import { PageBasic } from './basic'
import { sendData, receiveData } from '@/utils/chromeUtils'
/**
 * @description 处理页面数据
 */
export class PageDataCom extends PageBasic {
  private _sendTime:number = 0
  private _loadInfo:any = {}
  private _getLoadInfo:any = {}

  constructor (loadInfo:any) {
    super()
    this._loadInfo = loadInfo
    this.sendInfoEvent()
    this.addListeners()
  }

  get loadInfoData () {
    return this._loadInfo
  }

  /**
   * @description 获取页面加载数据
   */
  getObserverLoadInfo () {
    const handlers = (list:any) => {
      if (observer) {
        observer.disconnect()
      }
      this._loadInfo.observerInfo = list.getEntries()
    }
    const observer = new PerformanceObserver(handlers)
    observer.observe({ type: 'paint', buffered: true }) // 获取从页面加载开始到页面内容的任何部分在屏幕上完成渲染的时间
    observer.observe({ type: 'largest-contentful-paint', buffered: true }) // 获取页面首次加载的可视区域内可见的最大图像或文本块完成渲染的相对时间
  }

  /**
   * @description 获取页面加载信息
   */
  sendInfo () { // 发送信息
    const loadTime = (self.performance.timing.loadEventEnd - self.performance.timing.connectStart) / 1000
    const entries = self.performance.getEntries().filter((el:any) => el.initiatorType)
    sendData(// 将消息发送给background/background.js中转给插件页面
      {
        dataType: 'pageLoadDataInfo',
        pageLoadDataInfo: {
          loadInfo: this._getLoadInfo,
          loadTime,
          entries,
          sendTime: this._sendTime
        }
      }
    )
  }

  sendInfoEvent () { // 轮询获取数据并发送信息
    this.getObserverLoadInfo()
    this.sendInfo()
    const infoTimer = setInterval(() => {
      this.getObserverLoadInfo()
      this.sendInfo()
      if (this._loadInfo.observerInfo && this._loadInfo.observerInfo[0].startTime) {
        if (JSON.stringify(this._getLoadInfo) !== JSON.stringify(this._loadInfo)) {
          this._getLoadInfo = JSON.parse(JSON.stringify(this._loadInfo))
        } else {
          clearInterval(infoTimer)
          this.sendInfo()
        }
      }
    }, 2000)
  }

  /**
  * @description 监听传递的消息
  */
  addListeners () {
    receiveData((request:any, sender:any, callback:any) => {
      if (request.dataType === 'getBrowserInfo') { // 获取浏览器信息
        this.sendInfo()
      } else if (request.dataType === 'doRemind') { // 执行备忘提示
        this.doRemind(request.data, callback)
      }
      if (request.dataType !== 'doRemind') {
        callback()
      }
      return true
    })
  }

  /**
   * @description 备忘提醒展示
   * @param { Object } data 备忘数据
   * @param { Function } cb 回调
   */
  doRemind (data: any, cb?: any) {
    if (data.name) {
      const time = Date.now()
      this.pluginMainDom.append(`
        <div id="remind-${time}" class="pop-common remind-pop">
          <div class="pop-cover"></div>
          <div class="pop-main">
            <h3>备忘提示</h3>
            <p></p>
            <a class="remind-pop-btn-confirm" href="javascript:;" title="确认">确认</a>
          </div>
        </div>
      `)
      $(`#remind-${time} p`).html(JSON.parse(JSON.stringify(data).replace(/\\n/g, '<br/>')).name)
      $(`#remind-${time}`).addClass('pop-show')
    }
    const cbData: any = {
      status: this.pluginMainDom ? 'succ' : 'fail'
    }
    cb && cb(cbData)
  }
}

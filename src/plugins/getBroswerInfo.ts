/**
 * @description 需要第一时间触发的事件
 */
export class FirstTime2RunEvents {
  viewportWidth:number = self.innerWidth
  viewportHeight:number = self.innerHeight
  loadInfo
  constructor (loadInfo:any) {
    this.loadInfo = loadInfo
    this.getFirstPageLoadInfo()
  }

  get loadInfoData () {
    return this.loadInfo
  }

  /**
   * @description 是否为首屏元素
   */
  isInScreen (dom: any):boolean {
    const rectInfo = dom.getBoundingClientRect ? dom.getBoundingClientRect() : {}
    if (rectInfo.left < this.viewportWidth && rectInfo.top < this.viewportHeight) {
      return true
    }
    return false
  }

  /**
   * @description 获取首屏dom渲染时间
   */
  getFirstPageLoadInfo () {
    this.loadInfo.domPaintInfo = []
    const next = self.requestAnimationFrame ? self.requestAnimationFrame : setTimeout
    const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK', 'META', 'HEAD', 'TITLE', 'TEXT']
    const entry:any = {
      startTime: 0,
      children: []
    }
    const getAllNodes = (mutationList:any) => {
      for (const mutation of mutationList) {
        const item = mutation.addedNodes ? mutation.addedNodes : mutation
        if (item[0] && !ignoreDOMList.includes(item[0].nodeName) && item[0].localName) { // 过滤不需要的dom && 存在标签
          if (this.isInScreen(mutation.target ? mutation.target : item)) {
            if (item[0].childNodes && item[0].childNodes.length) {
              getAllNodes(item[0].childNodes)
            } else {
              entry.children.push(item[0])
            }
          }
        }
      }
    }

    const observer = new MutationObserver((mutationList:any) => {
      getAllNodes(mutationList)
      if (entry.children.length) {
        this.loadInfo.domPaintInfo = [entry]
        next(() => {
          entry.startTime = performance.now()
        })
        this.loadInfo.imgPaintTime = this.getRenderTime()
      }
    })

    observer.observe(document, {
      childList: true,
      subtree: true
    })
  }

  /**
   * @description 获取图片渲染事件
   */
  getRenderTime () {
    let startTime = 0
    this.loadInfo.domPaintInfo.forEach((entry:any) => {
      if (entry.startTime > startTime) {
        startTime = entry.startTime
      }
    })
    let imgTimeStart = 0
    let imgTimeEnd = 0

    performance.getEntriesByType('resource').forEach((item:any) => {
      if (item.initiatorType === 'img') {
        if (imgTimeStart > item.fetchStart || imgTimeStart === 0) {
          imgTimeStart = item.fetchStart
        }
        if (imgTimeEnd < item.responseEnd) {
          imgTimeEnd = item.responseEnd
        }
      }
    })
    return imgTimeEnd - imgTimeStart
  }

  /**
   * @description 获取dom加载信息
   */
  getDomLoadInfo () {
    this.loadInfo.domInfo = []
    const onEvent = (type: string) => {
      const callback = () => {
        this.loadInfo.domInfo.push({
          type: 'performance',
          subType: type.toLocaleLowerCase(),
          startTime: performance.now()
        })
        self.removeEventListener(type, callback, true)
      }

      self.addEventListener(type, callback, true)
    }
    ['load', 'DOMContentLoaded'].forEach(type => onEvent(type))
  }
}

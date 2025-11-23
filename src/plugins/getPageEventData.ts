import $ from 'jquery'
import { PageBasic } from './basic'
import { sendData } from '@/utils/chromeUtils'
/**
 * @description 处理页面默认事件
 */
export class PageEventCom extends PageBasic {
  constructor () {
    super()
    this.dealPageEvent()
    this.logBrowseInfo()
  }

  /**
   * @desc 处理csdn类网站
   */
  dealPageEvent () { // 处理页面事件
    const codeDom:any = $('pre,code')
    codeDom.css({ // 处理网页无法选中
      'user-select': 'auto',
      '-webkit-user-select': 'auto'
    })
    $('#plugin-add-all').on('click', '.remind-pop-btn-confirm', function () { // 备忘提醒关闭弹窗
      const popDom = $(this).parents('.remind-pop')
      popDom.removeClass('pop-show')
      setTimeout(() => { // 关闭动画后移除dom
        popDom.remove()
      }, 700)
    })
  }

  /**
   * @desc 记录浏览信息
   */
  logBrowseInfo () {
    const loadUrl = self.location.href
    sendData({ // 将消息发送给background/background.js中转给插件页面
      dataType: 'urlLog',
      loadUrl
    })
  }
}

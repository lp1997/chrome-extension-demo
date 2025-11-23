/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery'
import { PageDataCom } from './getPageComData'
import { PageEventCom } from './getPageEventData'
import { FirstTime2RunEvents } from './getBroswerInfo'

let loadInfo: any = {}
/**
 * @description 第一时间触发的事件
 */
const firstTime2Run = () => {
  const events = new FirstTime2RunEvents(loadInfo)
  loadInfo = events.loadInfoData
}

/**
 * @description 加载完毕，处理页面事件
 */
const loadTimer = setInterval(() => {
  if (self.performance.timing.loadEventEnd > 0) {
    clearInterval(loadTimer)
    if ($('body').length) {
      $('body').append('<div id="plugin-add-all"></div>')
    } else {
      $('html').append('<div id="plugin-add-all"></div>')
    }
    const data = new PageDataCom(loadInfo)
    const event = new PageEventCom()
  }
}, 200)

firstTime2Run()

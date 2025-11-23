import { getCurrentTabId, sendMsgToTabById } from '@/utils/chromeUtils'
export const queryLinkString = (key:string, href:string) => { // 获取链接参数内容
  href = href === undefined ? location.search : href
  const m = new RegExp('(?:&|/?)' + key + '=([^&$]+)').exec(href)
  return m ? m[1] : ''
}
export const queryLinkStringList = (href:string) => { // 获取链接参数内容列表
  href = href === undefined ? location.search : href
  const params:any = []
  let index = 0
  href.replace(/([^?&=]+)=([^&=]+)/ig, function ($, $1, $2):any {
    params[index] = {}
    params[index].key = $1
    params[index].val = $2
    params[index].decodeVal = getDecode($2)
    index++
  })
  return params
}
export const getDecode = (val:string):string => { // encode字段获取最终decode
  let result = ''
  const changeResult = decodeURIComponent(val)
  if (val === changeResult) {
    result = val
  }
  return result || getDecode(changeResult)
}

export const sec2Time = (t:number, type:string):string => { // 秒转时间格式
  const h = Math.floor(t / 60 / 60)
  const m = Math.floor(t / 60) - h * 60
  const s = Math.floor(t % 60)
  const timeData:any = {
    h,
    m,
    s
  }
  const typeList = type.split('')
  let res = ''
  let padNum = 1
  let isExcludeZero = false
  for (let e = 0, len = typeList.length; e < len; e++) {
    if ((typeof timeData[typeList[e]] === 'number' && timeData[typeList[e]] !== 0) || isExcludeZero) { // 排除首部的0的数据
      isExcludeZero = true
      if (typeList[e + 1] && typeList[e + 1] === typeList[e]) { // 数字为2位的格式
        padNum++
        continue
      }
      if (Object.keys(timeData).includes(typeList[e])) { // 添加数字
        res += timeData[typeList[e]].toString().padStart(padNum, 0)
        padNum = 1
      } else { // 添加单位
        res += typeList[e]
      }
    }
  }
  return res
}

export const formatTime = (type:string, t?:number):string => { // 格式化时间
  const time = t ? new Date(t) : new Date()
  const y = time.getFullYear()
  const M = ((time.getMonth() + 1) + '').padStart(2, '0')
  const d = (time.getDate() + '').padStart(2, '0')
  const h = (time.getHours() + '').padStart(2, '0')
  const m = (time.getMinutes() + '').padStart(2, '0')
  const s = (time.getSeconds() + '').padStart(2, '0')
  const timeData:any = {
    y,
    M,
    d,
    h,
    m,
    s
  }
  const typeList = type.split('')
  let res = ''
  for (const e in typeList) {
    if (typeList[e].match(/[a-zA-Z]/)) {
      res += timeData[typeList[e]]
    } else {
      res += typeList[e]
    }
  }
  return res
}

export const getDaysShort = (day1:number, day2:number):number => {
  // sDate1和sDate2是"2002-12-18"格式
  const sDate1 = formatTime('y-M-d', day1)
  const sDate2 = formatTime('y-M-d', day2)
  let aDate
  aDate = sDate1.split('-')
  const oDate1 = +new Date(~~aDate[0], ~~aDate[1] - 1, ~~aDate[2])
  aDate = sDate2.split('-')
  const oDate2 = +new Date(~~aDate[0], ~~aDate[1] - 1, ~~aDate[2])
  const iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24 + '')
  if ((oDate1 - oDate2) < 0) {
    return -iDays
  }
  return iDays
}

export const pageGo = (url:string) => { // 跳转
  self.chrome.tabs.create({ url })
}

export const ms2s = (ms:number):string => { // 毫秒转秒
  return ms ? (ms / 1000).toFixed(3) + 's' : '获取中……'
}

export const downloadStrAsFile = (content: string, fileName: string, fileType: string = 'text/plain') => { // 将字符串生成文件并下载
  const data = JSON.stringify(content)
  const blob = new Blob([data], { type: fileType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  self.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
export const readFileData = (file: File): Promise<string> => { // 读取文件内容
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e:any) => {
      const fileContent = e.target.result
      resolve(fileContent)
    }
    reader.readAsText(file)
  })
}

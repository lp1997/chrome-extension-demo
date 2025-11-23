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

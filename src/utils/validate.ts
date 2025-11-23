export const vailLink = (val:string):boolean => { // 是否链接
  return !val || /^(https?:)?\/\//.test(val)
}

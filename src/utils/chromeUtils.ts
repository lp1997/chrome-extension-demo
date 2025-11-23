// 信息存储(self.chrome.storage.sync 一个插件总的限制为100kb【会根据用户跨浏览器同步更新】，self.chrome.storage.local为5mb【只存在当前浏览器本地】)
export const localSet = (key:string, val:string) => { // 添加缓存
  self.chrome.storage.local.set({ [key]: val })
}
export const localGet = (key?:string[]) => { // 获取缓存
  return new Promise((resolve) => {
    self.chrome.storage.local.get(key, (res:string) => {
      resolve(res)
    })
  })
}
export const localRemove = (key:string) => { // 删除缓存
  return self.chrome.storage.local.remove(key)
}

export const getCurrentTabId = ():Promise<number> => { // 获取当前页面id
  return new Promise((resolve) => {
    self.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      if (tabs && tabs[0] && tabs[0].id) {
        resolve(tabs[0].id)
      } else {
        setTimeout(() => {
          getCurrentTabId().then(resolve)
        }, 3e3)
      }
    })
  })
}

export const getPageInfo = () => { // 获取当前页面信息
  return new Promise((resolve) => {
    self.chrome.tabs.query({ active: true, currentWindow: true }, (tabs:[{id:number}]) => {
      resolve(tabs)
    })
  })
}

export const sendMsgToTabById = (tabId:number, data:any, cb?:Function) => { // 发送消息到对应id的页面
  self.chrome.tabs.sendMessage(tabId, data, (res:any) => {
    cb && cb(res)
  })
}

export const receiveData = (cb?:Function) => { // 非popup接收信息
  self.chrome.runtime.onMessage.addListener((req:any, sender:any, sendRes:any) => {
    cb && cb(req, sender, sendRes)
  })
}

export const sendData = (data:any, cb?:Function) => { // 发送信息给background
  self.chrome.runtime.sendMessage(data, (res:any) => { // 接收返回的消息
    cb && cb(res)
  })
}

export const receiveConnectData = (cb?:Function) => { // 接口信息获取
  self.chrome.runtime.onConnect.addListener((port:any) => {
    port.onMessage.addListener(cb)

    port.onDisconnect.addListener((port:any) => {
      port.onMessage.removeListener(cb)
    })
  })
}

export const openNewPage = (url:string) => { // 页面打开新窗口链接
  self.chrome.tabs.create({ url })
}

export const listenPageCreated = (cb?:Function) => { // 监听窗口新建
  self.chrome.tabs.onCreated.addListener((res:any) => {
    cb && cb(res)
  })
}

export const listenPageActivated = (cb?:Function) => { // 监听窗口切换
  self.chrome.tabs.onActivated.addListener((res:any) => {
    cb && cb(res)
  })
}
export const onBeforeRequest = (cb:Function, urls:String[]) => { // 拦截请求
  self.chrome.webRequest.onBeforeRequest.addListener(cb, { urls }, ['blocking'])
}
export const getURL = (url: String): string => { // 拦截请求
  return self.chrome.runtime.getURL(url as string)
}
export const getDynamicRules = (rules: any): void => { // 当前的动态规则中获取实际生效的 rule ids
  self.chrome.declarativeNetRequest.getDynamicRules(rules)
}
export const updateDynamicRules = (rules: any, cb: any): void => { // 当前的动态规则中获取实际生效的 rule ids
  self.chrome.declarativeNetRequest.updateDynamicRules(rules, cb)
}
export const menuCreate = (settings: any): void => { // 右键菜单创建
  self.chrome.contextMenus.create(settings)
}
export const listenMenuEvent = (cb: any): void => { // 右键菜单点击监听
  self.chrome.contextMenus.onClicked.addListener(cb)
}

## Start
node: 16+

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run watch
```

### Compiles and minifies for production
```
npm run build:prod
```

### Compiles and minifies for local
```
npm run build:local
```

### Lints and fixes files
```
npm run lint
```

### 文件结构

```
src
├─assets -- 资源文件
  ├─icon128.png
  ├─icon16.png
  └─icon48.png
├─background -- 插件背景文件（浏览器运行则一直在运行/通信存在于浏览器）
  ├─background.ts -- 通用事件
  ├─serviceWorker.ts -- 网络请求事件
  └─menu.ts -- 鼠标右键菜单
├─css -- web页面额外样式
  └─...
├─plugins -- 打包的主要文件
  ├─main.ts -- 运行于当前web页面，可用于操控当前页面，相当于在调试工具的控制台操作（通信存在于web页面方）
  └─manifest.json -- 配置文件（必须）
├─pages -- 展示在浏览器里的插件页面
  ├─index.html
  ├─main.ts -- 页面入口
  ├─router -- 路由
    ├─routers.ts -- 路由列表
    └─index.ts -- 路由配置
  └─components -- 插件页面
    ├─App.vue
    └─pages
      └─...
├─popup -- 插件页面（通信存在于插件）
  ├─index.html
  ├─data.ts -- 定义数据
  ├─typeList.ts -- 定义类型
  ├─main.ts
  ├─router -- 路由
    ├─routers.ts -- 路由列表
    └─index.ts -- 路由配置
  └─components -- 插件页面
    ├─App.vue
    ├─common -- 组件
    └─pages -- 页面
      └─...
├─rules -- 规则
  └─rules.json -- 网络请求规则配置（可以自定义页面请求加载规则，例如：屏蔽/重写网络请求）
└─utils -- 工具函数
  ├─backgroundUtils.ts -- 在背景页单独使用的函数
  ├─chromeUtils.ts -- chrome API相关函数
  ├─comUtils.ts -- 公用函数
  ├─validate.ts -- 验证函数
  └─utils.ts -- vue相关函数

```

### 说明文档

- [开发流程](https://share.note.youdao.com/s/yoZ1OCD)

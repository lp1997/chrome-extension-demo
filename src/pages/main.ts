import { createApp } from 'vue'
import App from './components/App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Bus from '@/utils/bus'

self.Bus = Bus
createApp(App)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app')

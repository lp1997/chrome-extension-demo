import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import ComTable from '@/popup/views/common/ComTable.vue'
import VisibleItem from '@/popup/views/common/VisibleItem.vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Bus from '@/utils/bus'

self.Bus = Bus
createApp(App)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .component('ComTable', ComTable)
  .component('VisibleItem', VisibleItem)
  .mount('#app')

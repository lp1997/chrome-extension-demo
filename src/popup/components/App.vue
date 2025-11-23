<template>
  <div class="chrome-extension-main">
    <div class="tabs">
      <el-tabs :stretch="true" type="border-card" v-model="tabIndex" @tabChange="tabChange">
        <el-tab-pane v-for="(item,e) in filterTableData" :name="item.path" :key="e" :label="item.title" ></el-tab-pane>
      </el-tabs>
    </div>
    <el-scrollbar max-height="550px" ref="scrollRef">
      <div class="page-com">
        <router-view />
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { localGet } from '@/utils/chromeUtils'
import { routerMain } from '@popup/router/routers'
import { useRouter } from 'vue-router'
import { pageTabs } from '@/popup/typeList'
const router = useRouter()

const selList = ref<string[]>(['更新记录'])
const scrollRef = ref<any>()
const tabIndex = ref<string>('/')

const filterTableData = ref<pageTabs[]>([])

localGet(['selTypeList']).then((res:any) => { // 获取tab选择
  if (res.selTypeList) {
    selList.value = JSON.parse(res.selTypeList)
  }
  changeUserType(selList.value)
})
const changeUserType = (val:string[]) => { // tab页面选择更新
  selList.value = val
  filterTableData.value = []
  nextTick(() => {
    const addTabList = []
    for (const el of selList.value) { // 添加选中的tab页面
      if (routerMain.find((item:{name:string}) => item.name === el)) {
        addTabList.push(routerMain.find((item:{name:string}) => item.name === el) as pageTabs)
      }
    }
    filterTableData.value = [...[routerMain[0]], ...addTabList, ...[routerMain[1]]]
  })
}

self.Bus.$on('updateTab', (val:string[]) => { // 更新tab选择
  changeUserType(val)
})

const tabChange = (name:string) => { // tab切换
  router.push(name)
}
</script>

<style lang="stylus">
.line-clamp-1 {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.chrome-extension-main{
  position: relative
  width: 650px
  min-height: 450px
  .tabs{
    width: 100%
    .el-tabs__content{
      display: none
    }
  }
  .page-com{
    padding: 15px
  }
  .flex{
    display: flex
  }
  .flex-center{
    justify-content: center
  }
  .isLink{
    text-decoration: underline
    cursor pointer
  }
  .t-center{
    text-align: center
  }
}
.setting-btn-cont{
  display: flex
  .el-button{
    margin: 0 10px 10px 0
  }
}
</style>

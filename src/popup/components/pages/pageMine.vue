<template>
  <div class="page-mine">
    <SettingPage v-if="showSetting" @back="showSetting = false" />
    <template v-else>
      <!-- 配置功能列表 -->
      <el-button type="primary" :icon="Setting" @click="showFuncList = true">配置插件功能</el-button>
      <el-button type="primary" :icon="Setting" @click="showSetting = true">设置</el-button>
      <div class="versions-info">
        <el-button type="primary" @click="goDesc()">更多说明</el-button>
        <span class="current-version">当前版本：{{ versionList[0].version }}</span>
      </div>
      <VisibleItem :name="'浏览排行'">
        <ComTable
          :configData="{
            maxHeight: '350',
            titleCenter: 1
          }"
          :listData="urlStoreListData"
          :extraData="{
            title: '浏览排行',
            headerList: [
              {
                key: 'linkPath',
                link: 'link',
                width: '500px',
                label: '地址',
              },
              {
                key: 'num',
                label: '次数',
              },
            ]
          }"
        />
      </VisibleItem>
      <VisibleItem :name="'时长统计'">
        <ComTable
          :configData="{
            maxHeight: '350',
            titleCenter: 1,
            tableRowClassName: tableRowClassName
          }"
          :listData="dateDataList"
          :extraData="{
            title: '时长统计',
            headerList: [
              {
                key: 'date',
                label: '日期',
              },
              {
                key: 'parseTime',
                label: '打开时间',
              },
              {
                key: 'parseCurrentTime',
                label: '结束时间',
              },
              {
                key: 'parseTimeLen',
                label: '时间间隔',
              },
            ]
          }"
        />
      </VisibleItem>
      <el-dialog v-model="showFuncList" :width="450">
        <el-checkbox-group v-model="checkListSel" :max="5">
          <div v-for="(el, e) in routerMain" :key="e">
            <el-checkbox v-if="!el.isCom" :label="el.title" :value="el.name" border />
          </div>
        </el-checkbox-group>
        <div class="btn-cont flex">
          <el-button type="info" style="width: 50%" @click="selCancel">取消</el-button>
          <el-button type="primary" style="width: 50%" @click="selConfirm">确定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script lang="ts">
import SettingPage from '@/popup/components/pages/pageComponents/settingPage.vue'
import { Setting } from '@element-plus/icons-vue'
import { routerMain } from '@/popup/router/routers'
import { localGet, localSet } from '@/utils/chromeUtils'
import { sec2Time, formatTime, getDaysShort } from '@/utils/comUtils'
import { pageTabs } from '@/popup/typeList'
import { ref, reactive } from 'vue'
import { versionList } from '@popup/data'

export default {
  name: 'pageMine'
}
</script>
<script lang="ts" setup>
const showFuncList = ref<any>(false) // 显示插件功能配置弹窗
const showSetting = ref<boolean>(false) // 显示设置页
const checkList = ref<pageTabs[]>([])// 选择的功能列表
const checkListSel = ref<pageTabs[]>([])// 选中未确认的功能列表
const dateDataList = reactive<any>([])// 近七天数据
const urlStoreListData = reactive<any>([])// 网址访问数据
const tableRowClassName = ({ // 数据添加类状态
  rowIndex
}: { rowIndex: number }) => {
  if (~~rowIndex === 0) {
    return 'danger-row'
  }
  if (~~rowIndex < 3) {
    return 'warning-row'
  }
  return 'success-row'
}
localGet(['todayDataList', 'selTypeList']).then((res: any) => { // 取设置缓存
  const getDateDataList = res.todayDataList ? JSON.parse(res.todayDataList) : []
  dateDataList.value = getDateDataList.map((el: any) => {
    el.parseTime = formatTime('h:m:s', el.time)
    el.parseCurrentTime = formatTime('h:m:s', el.currentTime) + ' ' + (getDaysShort(el.currentTime, el.time) ? '+' + getDaysShort(el.currentTime, el.time) : '')
    el.parseTimeLen = sec2Time((el.currentTime - el.time) / 1000, 'h小时m分钟') || sec2Time((el.currentTime - el.time) / 1000, 's秒')
    return el
  })
  if (res.selTypeList) {
    checkListSel.value = checkList.value = JSON.parse(res.selTypeList)
  }
})

const selCancel = () => { // 功能列表取消选择
  checkListSel.value = checkList.value
  showFuncList.value = false
}
const selConfirm = () => { // 功能列表确认选择
  checkList.value = checkListSel.value
  showFuncList.value = false
  self.Bus.$emit('updateTab', checkList.value)
  localSet('selTypeList', JSON.stringify(checkList.value))
}

/**
 * @description 链接log存储
 */
localGet(['urlStoreList']).then((res:any) => {
  const urlStoreListLocal = res.urlStoreList ? JSON.parse(res.urlStoreList) : []
  urlStoreListData.value = urlStoreListLocal ? urlStoreListLocal.slice(0, 5) : [] // 只取5条
})

const goDesc = () => {
  self.open('/pages.html#/Test')
}

</script>

<style lang="stylus" scoped>
.page-mine{
  position: relative
}
:deep().progress-cont{
  text-align: center
  margin: 10px 0
  .el-progress__text{
    font-size: 16px !important
    line-height: 26px !important
    margin-top: -5px
    .big{
      font-size: 24px !important
    }
  }
}
.el-dialog{
  .el-checkbox-group{
    display: flex
    flex-wrap: wrap
    .el-checkbox{
      margin: 0 10px 10px
    }
  }
  .btn-cont{
    margin-top: 30px
  }
  .switch-list{
    // margin-top: 15px
    h3{
      margin-bottom: 20px
    }
    .switch-item{
      margin: 0 0 14px
      .switch-main{
        font-size: 0
        display: flex
        // align-items: center
        .el-switch{
          height: 24px
        }
        span{
          color: #333
          font-size: 16px
          font-weight: bold
          line-height: 24px
          margin-right: 10px
        }
      }
      .switch-tips{
        color: #999
        font-size: 12px
        margin: 2px 0 0 0
      }
    }
  }
}
.commonly-list{
  .cell{
    position: relative
    span{
      position: absolute
      left: -14px
    }
  }
}
.versions-info{
  position: absolute
  right: 10px
  top: 0
  display: flex
  flex-direction: column
  text-align: center
  .current-version{
    margin-top: 10px
  }
  .el-button{
    position: relative
  }
  .has-new-version{
    &:after{
      content: ''
      position: absolute
      left: -3px
      top: -3px
      background: #de1a1a
      width: 9px
      height: 9px
      border-radius: 100%
    }
  }
}
</style>

<template>
  <div class="page-info">
    <div class="page-info-sec flex has-border">
      <!-- 页面基本信息 -->
      <div class="qr-code-cont">
        <div class="err-info" v-if="qrCodeError">
          <span v-html="qrCodeError"></span>
        </div>
        <QrcodeVue :value="link" :size="150"/>
      </div>
      <div class="page-main-info l20">
        <el-descriptions title="页面信息" :column="1" size="small" border>
          <el-descriptions-item :width="'50%'">
            <template #label>
              <div class="cell-item">
                {{ '页面加载时间' }}
              </div>
            </template>
            {{ loadTime }}s
          </el-descriptions-item>
          <el-descriptions-item :width="'50%'">
            <template #label>
              <div class="cell-item">
                {{ '请求数' }}
              </div>
            </template>
            {{ entries }}个
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <VisibleItem :name="'页面加载信息'">
      <!-- 页面加载信息 -->
      <div class="page-main-info has-border">
        <el-descriptions title="加载信息" :column="1" size="small" border>
          <el-descriptions-item :width="'50%'">
            <template #label>
              <div class="cell-item">
                {{ '白屏时间' }}
              </div>
            </template>
            {{ ms2s(loadInfo.observerInfo && loadInfo.observerInfo[0].startTime) }}
          </el-descriptions-item>
          <el-descriptions-item :width="'50%'">
            <template #label>
              <div class="cell-item">
                {{ 'dom渲染时间' }}
              </div>
            </template>
            {{ ms2s(loadInfo.domPaintInfo && loadInfo.domPaintInfo[0].startTime) }}
          </el-descriptions-item>
          <el-descriptions-item :width="'50%'">
            <template #label>
              <div class="cell-item">
                {{ '图片渲染时间' }}
              </div>
            </template>
            {{ ms2s(loadInfo.imgPaintTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </VisibleItem>
    <VisibleItem :name="'链接参数列表'">
      <!-- 链接参数列表 -->
      <ComTable
        class="table-outer"
        :configData="{
          maxHeight: '200',
          needSearch: 1,
          searchKey: 'key'
        }"
        :listData="pageInfoList"
        :extraData="{
          title: '链接参数信息',
          searchPlaceholder: '字段名搜索',
          headerList: [
            {
              key: 'key',
              label: '字段',
            },
            {
              key: 'val',
              label: '值',
            },
            {
              key: 'decodeVal',
              label: '转码值'
            },
          ],
        }"
      />
    </VisibleItem>
  </div>
</template>
<script lang="ts">
import { ref, reactive } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { getPageInfo, receiveData, getCurrentTabId, sendMsgToTabById } from '@/utils/chromeUtils'
import { queryLinkStringList, ms2s } from '@/utils/comUtils'
export default {
  name: 'pageInfo'
}
</script>
<script lang="ts" setup>
const link = ref<string>('')
const qrCodeError = ref<string>('')
const loadTime = ref<number>(0)
const entries = ref<number>(0)
const pageInfoList = reactive<any>([])
const loadInfo = ref<any>([])
let getLink: string = '' // 页面地址

console.log(self.chrome)

const getInfo = async () => {
  receiveData(async (request:any, sender:any, callback:Function) => { // 接收数据
    if (request.dataType === 'pageLoadDataInfo') { // 页面加载信息
      loadInfo.value = request.pageLoadDataInfo.loadInfo
      entries.value = request.pageLoadDataInfo.entries.length
      loadTime.value = request.pageLoadDataInfo.loadTime
    }
    callback()
  })
  getCurrentTabId().then(id => { // 发起获取浏览器信息请求
    sendMsgToTabById(id, { dataType: 'getBrowserInfo' })
  })
}
getInfo()

getPageInfo().then((tabs: any) => {
  getLink = tabs[0].url
  if (getLink.length * 8 <= 10208) { // 链接长度 <= qrcode最大长度
    link.value = getLink
  } else {
    qrCodeError.value = '生成失败<br/>链接太长了~'
  }
  pageInfoList.value = queryLinkStringList(getLink)
})

</script>

<style lang="stylus" scoped>
.page-main-info{
  width: 100%
}
.qr-code-cont{
  position: relative
  .err-info{
    position: absolute
    left: 0
    top: 0
    z-index: 10
    width: 100%
    height: 100%
    background rgba(0,0,0,0.7)
    color: #fff
    font-size: 16px
    line-height: 24px
    text-align: center
    font-weight: bold
    display: flex
    align-items: center
    justify-content: center
  }
}
.page-info-sec{
  padding-bottom: 10px
}
.has-border{
  border-bottom: solid 1px rgba(0,0,0,0.2)
}
.el-descriptions{
  margin: 10px 0
}
.el-button{
  margin: 0 6px 10px
  &:last-child{
    margin-bottom: 0
  }
}
:deep() .table-outer h3{
  font-size: 14px !important
}
.l20{
  margin-left: 20px
}
.t10{
  margin-top: 10px
}
</style>

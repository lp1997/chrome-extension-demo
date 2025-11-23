<template>
  <div>
    <el-button class="btn-back" type="primary" @click="back"
      >返回</el-button
    >
    <el-collapse v-model="showSetting" accordion>
      <el-collapse-item :title="el" :name="e" v-for="(el,e) in settingList" :key="e">
        <ComTable
          :configData="{
            height: '350',
            needSearch: 1,
            searchKey: 'key',
            needSelect: 1,
          }"
          :listData="filterTableData"
          :extraData="{
            searchPlaceholder: '缓存字段搜索',
            headerList: [
              {
                key: 'key',
                label: '缓存字段',
                width: '200'
              },
              {
                key: 'desc',
                label: '说明',
              },
              {
                label: '操作',
                slotName: 'events',
                type: 'fixedBtn',
                width: '120'
              },
            ]
          }"
          @selUpdate="selUpdate"
        >
          <template #headBtn>
            <el-upload
              class="upload-demo"
              action="/upload"
              :before-upload="beforeUpload"
            >
              <el-button class="btn-import l20" type="primary">导入</el-button>
            </el-upload>
            <el-button class="btn-export l10" type="primary" @click="exportData()">
              导出
            </el-button>
          </template>
          <template #events="scope">
            <el-button
              type="primary"
              :icon="Edit"
              title="修改"
              circle
              @click.prevent="editItem(scope.row)"
            />
            <el-button
              type="danger"
              :icon="Delete"
              title="删除"
              circle
              @click.prevent="quesDelItem(scope.row)"
            />
          </template>
        </ComTable>
      </el-collapse-item>
    </el-collapse>
    <el-dialog v-model="showPopStorageInfo" :width="450">
      <el-input
        class="text-args"
        v-model="storageShowData"
        :autosize="{ minRows: 4, maxRows: 8 }"
        type="textarea"
        placeholder="请输入缓存内容"
      />
      <div class="edit-btn-cont flex">
        <el-button type="info" style="width: 50%" @click="showPopStorageInfo = false"
          >取消</el-button
        >
        <el-button type="primary" style="width: 50%" @click="editConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { storageDataList } from '@/popup/data'
import { storageDataItemType } from '@/popup/typeList'
import { localGet, localSet, localRemove } from '@/utils/chromeUtils'
import { downloadStrAsFile, readFileData } from '@/utils/comUtils'
import { ref, reactive, defineEmits } from 'vue'
import {
  Delete, Edit
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'setting'
}
</script>
<script lang="ts" setup>
// 设置列表
const settingList = ref<string[]>(['缓存管理'])
const showSetting = ref<number>(-1) // 展开第几个设置内容
const storageDataAll = {} as any // 缓存数据
// 缓存相关
const filterTableData = reactive<any>([]) // 缓存列表
const showPopStorageInfo = ref<boolean>(false) // 修改缓存的弹窗
const storageShowData = ref<string>('') // 修改的缓存展示内容
const showStorageItemData = ref<storageDataItemType>({ key: '', desc: '', dataStr: '', sort: 0 }) // 修改的缓存数据
let selListData = [] as any

interface Emit {
  (ev: 'back'): void // 返回
}
const emit = defineEmits<Emit>()
const back = () => {
  emit('back')
}

// 缓存处理
const updateStorageData = () => { // 更新缓存
  localGet().then((res:any) => { // 取设置缓存
    const listData = [] as storageDataItemType[]
    for (const key in res) {
      storageDataAll[key] = res[key]
      listData.push({
        key,
        desc: storageDataList[key] ? storageDataList[key].name : '',
        dataStr: res[key],
        sort: storageDataList[key] ? storageDataList[key].sort : 999,
        ifNotExport: storageDataList[key] ? !!storageDataList[key].ifNotExport : false
      })
    }
    filterTableData.value = listData.sort((a:any, b:any) => a.sort - b.sort)
  })
}
updateStorageData()

// 修改
const editItem = (data:storageDataItemType) => {
  showStorageItemData.value = data
  storageShowData.value = data.dataStr
  showPopStorageInfo.value = true
}
// 确认修改
const editConfirm = () => {
  try {
    const parse = JSON.parse(storageShowData.value) // 确认是正确的json格式
    showStorageItemData.value.dataStr = storageShowData.value
    localSet(showStorageItemData.value.key, showStorageItemData.value.dataStr)
    showPopStorageInfo.value = false
    updateStorageData()
    ElMessage({
      type: 'success',
      message: '修改成功'
    })
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '修改失败,请检查数据'
    })
  }
}

// 是否删除
const quesDelItem = (item:storageDataItemType) => {
  ElMessageBox.confirm(
    '是否确认删除',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      delItem(item)
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
}
// 删除
const delItem = (item:storageDataItemType) => {
  localRemove(item.key)
  updateStorageData()
}

// 导入
const beforeUpload = (file:File) => {
  readFileData(file).then((fileContent:string) => {
    try {
      const updateData = JSON.parse(fileContent)
      if (typeof updateData !== 'object') {
        throw Error('数据格式不正确')
      }
      ElMessageBox.confirm(
        '导入将覆盖所有数据，是否确认',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          for (const key in updateData) {
            localSet(key, updateData[key])
          }
          updateStorageData()
          ElMessage({
            type: 'success',
            message: '导入成功'
          })
        })
    } catch (error:any) {
      ElMessage({
        type: 'error',
        message: error.message || '导入失败'
      })
    }
  })
  return false // 阻止上传
}
// 导出
const exportData = () => {
  const finalData = {} as any
  for (const item of selListData) {
    finalData[item.key] = storageDataAll[item.key]
  }
  if (!Object.keys(finalData).length) {
    return ElMessage({
      type: 'error',
      message: '请先选择要导出的缓存'
    })
  }
  downloadStrAsFile(finalData, 'chrome-extension-storage', 'text/plain')
}
// 更新列表选择数据
const selUpdate = (data:any) => {
  selListData = data.filter((el:any) => el.sel && !el.ifNotExport)
}
</script>

<style lang="stylus" scoped>
.btn-back{
  margin-bottom: 10px
}
.edit-btn-cont{
  margin-top: 20px
}
.l10{
  margin-left: 10px
}
.l20{
  margin-left: 20px
}
:deep() .el-upload-list{
  margin: 0
  // display: none
}
</style>
